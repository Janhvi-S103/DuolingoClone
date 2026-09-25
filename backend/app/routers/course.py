from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Course, Unit, Skill, UserSkillProgress
from ..schemas import CoursePathResponse, UnitPathItem, SkillPathItem, UserResponse

router = APIRouter(prefix="/api/course", tags=["course"])

@router.get("/path", response_model=CoursePathResponse)
def get_course_path(db: Session = Depends(get_db)):
    course = db.query(Course).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get user progress mapping: skill_id -> UserSkillProgress
    progress_map = {
        p.skill_id: p
        for p in db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user.id).all()
    }

    units = db.query(Unit).filter(Unit.course_id == course.id).order_by(Unit.order_index).all()
    unit_items = []

    for unit in units:
        skills = db.query(Skill).filter(Skill.unit_id == unit.id).order_by(Skill.order_index).all()
        skill_items = []

        for skill in skills:
            prog = progress_map.get(skill.id)
            completed_lessons = prog.completed_lessons if prog else 0
            is_unlocked = prog.is_unlocked if prog else False
            is_completed = prog.is_completed if prog else False
            crown_level = prog.crown_level if prog else 0

            skill_items.append(SkillPathItem(
                id=skill.id,
                unit_id=skill.unit_id,
                order_index=skill.order_index,
                title=skill.title,
                icon=skill.icon,
                total_lessons=skill.total_lessons,
                position_x=skill.position_x,
                completed_lessons=completed_lessons,
                is_unlocked=is_unlocked,
                is_completed=is_completed,
                crown_level=crown_level
            ))

        unit_items.append(UnitPathItem(
            id=unit.id,
            order_index=unit.order_index,
            title=unit.title,
            description=unit.description,
            guidebook_content=unit.guidebook_content,
            theme_color=unit.theme_color,
            skills=skill_items
        ))

    return CoursePathResponse(
        course={"id": course.id, "title": course.title, "flag": course.flag, "code": course.code},
        units=unit_items,
        user=UserResponse.model_validate(user)
    )
