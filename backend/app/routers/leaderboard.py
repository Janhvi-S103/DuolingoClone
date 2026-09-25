from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import LeaderboardUser, User
from ..schemas import LeaderboardItem

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

@router.get("", response_model=List[LeaderboardItem])
def get_leaderboard(db: Session = Depends(get_db)):
    # Sync current user's XP with leaderboard entry
    user = db.query(User).first()
    lb_user = db.query(LeaderboardUser).filter(LeaderboardUser.is_current_user == True).first()
    if user and lb_user:
        lb_user.xp = user.total_xp
        db.commit()

    users = db.query(LeaderboardUser).order_by(LeaderboardUser.xp.desc()).all()
    results = []
    for rank, u in enumerate(users, start=1):
        results.append(LeaderboardItem(
            id=u.id,
            name=u.name,
            avatar=u.avatar,
            league=u.league,
            xp=u.xp,
            is_current_user=u.is_current_user,
            rank=rank
        ))
    return results
