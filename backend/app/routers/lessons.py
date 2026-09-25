import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import User, Skill, Lesson, Exercise, UserSkillProgress, LeaderboardUser, Achievement
from ..schemas import LessonResponse, ExerciseResponse, LessonCompleteRequest, LessonCompleteResponse

router = APIRouter(prefix="/api/lessons", tags=["lessons"])

@router.get("/by-skill/{skill_id}", response_model=LessonResponse)
def get_lesson_for_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    user = db.query(User).first()
    progress = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == user.id,
        UserSkillProgress.skill_id == skill_id
    ).first()

    completed = progress.completed_lessons if progress else 0
    lessons = db.query(Lesson).filter(Lesson.skill_id == skill_id).order_by(Lesson.order_index).all()
    if not lessons:
        raise HTTPException(status_code=404, detail="No lessons found for this skill")

    # Pick the next uncompleted lesson, or the last one if all completed
    lesson_idx = min(completed, len(lessons) - 1)
    target_lesson = lessons[lesson_idx]

    return get_lesson_by_id(target_lesson.id, db)

@router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson_by_id(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises = db.query(Exercise).filter(Exercise.lesson_id == lesson_id).order_by(Exercise.order_index).all()
    
    exercise_items = []
    for ex in exercises:
        try:
            parsed_data = json.loads(ex.data_json)
        except Exception:
            parsed_data = {}

        exercise_items.append(ExerciseResponse(
            id=ex.id,
            lesson_id=ex.lesson_id,
            order_index=ex.order_index,
            type=ex.type,
            prompt=ex.prompt,
            target_text=ex.target_text,
            audio_text=ex.audio_text,
            data=parsed_data
        ))

    return LessonResponse(
        id=lesson.id,
        skill_id=lesson.skill_id,
        order_index=lesson.order_index,
        title=lesson.title,
        xp_reward=lesson.xp_reward,
        exercises=exercise_items
    )

@router.post("/{lesson_id}/complete", response_model=LessonCompleteResponse)
def complete_lesson(
    lesson_id: int,
    req: LessonCompleteRequest,
    db: Session = Depends(get_db)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update user hearts if sent
    if 0 <= req.hearts_remaining <= user.max_hearts:
        user.hearts = req.hearts_remaining

    # Calculate XP
    base_xp = lesson.xp_reward
    bonus_xp = 5 if req.accuracy == 100 else 0
    xp_awarded = base_xp + bonus_xp

    user.total_xp += xp_awarded
    user.today_xp += xp_awarded

    # Update current user in leaderboard
    lb_user = db.query(LeaderboardUser).filter(LeaderboardUser.is_current_user == True).first()
    if lb_user:
        lb_user.xp = user.total_xp

    # Update progress on the skill
    skill = lesson.skill
    prog = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == user.id,
        UserSkillProgress.skill_id == skill.id
    ).first()

    skill_just_completed = False
    next_skill_unlocked = False

    if prog:
        prog.completed_lessons += 1
        if prog.completed_lessons >= skill.total_lessons:
            prog.is_completed = True
            prog.crown_level += 1
            skill_just_completed = True

            # Unlock next skill
            next_skill = db.query(Skill).filter(
                Skill.unit_id == skill.unit_id,
                Skill.order_index == skill.order_index + 1
            ).first()

            # If no more skills in current unit, unlock first skill in next unit
            if not next_skill:
                next_unit = db.query(skill.unit.__class__).filter(
                    skill.unit.__class__.order_index == skill.unit.order_index + 1
                ).first()
                if next_unit:
                    next_skill = db.query(Skill).filter(
                        Skill.unit_id == next_unit.id,
                        Skill.order_index == 1
                    ).first()

            if next_skill:
                next_prog = db.query(UserSkillProgress).filter(
                    UserSkillProgress.user_id == user.id,
                    UserSkillProgress.skill_id == next_skill.id
                ).first()
                if next_prog:
                    next_prog.is_unlocked = True
                    next_skill_unlocked = True

    # Update Achievements
    # 1. Sage (Total XP)
    ach_sage = db.query(Achievement).filter(Achievement.key == "sage").first()
    if ach_sage:
        ach_sage.current_value = user.total_xp
        if ach_sage.current_value >= ach_sage.target_value:
            ach_sage.is_unlocked = True

    # 2. Scholar (Completed Lessons)
    ach_scholar = db.query(Achievement).filter(Achievement.key == "scholar").first()
    if ach_scholar:
        ach_scholar.current_value += 1
        if ach_scholar.current_value >= ach_scholar.target_value:
            ach_scholar.is_unlocked = True

    # 3. Sharpshooter (100% accuracy)
    if req.accuracy == 100:
        ach_sharp = db.query(Achievement).filter(Achievement.key == "sharpshooter").first()
        if ach_sharp:
            ach_sharp.is_unlocked = True

    db.commit()
    db.refresh(user)

    msg = f"Fantastic! +{xp_awarded} XP earned!"
    if skill_just_completed:
        msg = f"Incredible! You completed '{skill.title}'! +{xp_awarded} XP"

    return LessonCompleteResponse(
        success=True,
        xp_awarded=xp_awarded,
        new_total_xp=user.total_xp,
        today_xp=user.today_xp,
        new_streak=user.streak,
        hearts=user.hearts,
        skill_completed=skill_just_completed,
        next_skill_unlocked=next_skill_unlocked,
        message=msg
    )
