from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database import get_db
from ..models import User, UserSkillProgress, LeaderboardUser, Achievement
from ..schemas import UserResponse, RefillHeartsResponse, SimulateDayResponse, ResetProgressResponse

router = APIRouter(prefix="/api/user", tags=["user"])

def get_current_user(db: Session = Depends(get_db)) -> User:
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/current", response_model=UserResponse)
def get_user_profile(user: User = Depends(get_current_user)):
    return user

@router.post("/refill-hearts", response_model=RefillHeartsResponse)
def refill_hearts(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.hearts >= user.max_hearts:
        return RefillHeartsResponse(
            success=True,
            hearts=user.hearts,
            gems=user.gems,
            message="Hearts are already full!"
        )
    
    # Check if user has enough gems, or practice refill
    cost = 50
    if user.gems >= cost:
        user.gems -= cost
        user.hearts = user.max_hearts
        db.commit()
        db.refresh(user)
        return RefillHeartsResponse(
            success=True,
            hearts=user.hearts,
            gems=user.gems,
            message="Hearts refilled using 50 gems!"
        )
    else:
        # Free practice refill
        user.hearts = user.max_hearts
        db.commit()
        db.refresh(user)
        return RefillHeartsResponse(
            success=True,
            hearts=user.hearts,
            gems=user.gems,
            message="Practice session completed! Hearts fully restored for free."
        )

@router.post("/heart-lost", response_model=UserResponse)
def heart_lost(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.hearts > 0:
        user.hearts -= 1
        db.commit()
        db.refresh(user)
    return user

@router.post("/simulate-day", response_model=SimulateDayResponse)
def simulate_day(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Parse last active date
    try:
        current_date = datetime.strptime(user.last_active_date, "%Y-%m-%d")
    except Exception:
        current_date = datetime.utcnow()
    
    next_date = current_date + timedelta(days=1)
    date_str = next_date.strftime("%Y-%m-%d")

    # If the user earned XP today, streak continues
    if user.today_xp > 0:
        user.streak += 1
        msg = f"A new day dawned ({date_str})! Streak maintained and increased to {user.streak} days 🔥"
    else:
        if user.has_streak_freeze:
            user.has_streak_freeze = False
            msg = f"Streak Freeze equipped! Streak of {user.streak} days protected for {date_str} ❄️"
        else:
            user.streak = 0
            msg = f"No activity logged. Streak reset to 0 for {date_str}."

    # Reset daily XP
    user.today_xp = 0
    # Regenerate hearts to max
    user.hearts = user.max_hearts
    user.last_active_date = date_str

    # Update wildfire achievement if applicable
    ach = db.query(Achievement).filter(Achievement.key == "wildfire").first()
    if ach:
        ach.current_value = user.streak
        if ach.current_value >= ach.target_value:
            ach.is_unlocked = True

    db.commit()
    db.refresh(user)

    return SimulateDayResponse(
        success=True,
        streak=user.streak,
        today_xp=user.today_xp,
        last_active_date=user.last_active_date,
        message=msg
    )

@router.post("/reset", response_model=ResetProgressResponse)
def reset_progress(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Reset user stats
    user.total_xp = 145
    user.today_xp = 15
    user.streak = 5
    user.hearts = 5
    user.gems = 480
    user.has_streak_freeze = True
    user.last_active_date = datetime.utcnow().strftime("%Y-%m-%d")

    # Reset progress table
    progresses = db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user.id).all()
    for idx, p in enumerate(progresses):
        if idx == 0:
            p.completed_lessons = 2
            p.is_unlocked = True
            p.is_completed = False
            p.crown_level = 1
        elif idx == 1:
            p.completed_lessons = 0
            p.is_unlocked = True
            p.is_completed = False
            p.crown_level = 0
        else:
            p.completed_lessons = 0
            p.is_unlocked = False
            p.is_completed = False
            p.crown_level = 0

    # Reset leaderboard
    lb_user = db.query(LeaderboardUser).filter(LeaderboardUser.is_current_user == True).first()
    if lb_user:
        lb_user.xp = 145

    db.commit()
    return ResetProgressResponse(
        success=True,
        message="Progress successfully reset to baseline demo state."
    )
