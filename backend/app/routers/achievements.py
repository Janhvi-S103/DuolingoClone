from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Achievement, User
from ..schemas import AchievementItem

router = APIRouter(prefix="/api/achievements", tags=["achievements"])

@router.get("", response_model=List[AchievementItem])
def get_achievements(db: Session = Depends(get_db)):
    user = db.query(User).first()
    achievements = db.query(Achievement).all()

    # Sync dynamically with user state
    if user:
        for ach in achievements:
            if ach.key == "wildfire":
                ach.current_value = user.streak
            elif ach.key == "sage":
                ach.current_value = user.total_xp
            if ach.current_value >= ach.target_value:
                ach.is_unlocked = True
        db.commit()

    return achievements
