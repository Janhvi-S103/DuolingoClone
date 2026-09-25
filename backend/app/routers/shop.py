from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import User

router = APIRouter(prefix="/api/shop", tags=["shop"])

class BuyItemRequest(BaseModel):
    item_id: str

@router.get("")
def get_shop_items(db: Session = Depends(get_db)):
    user = db.query(User).first()
    return {
        "gems": user.gems if user else 0,
        "items": [
            {
                "id": "heart_refill",
                "name": "Full Heart Refill",
                "description": "Restore all 5 hearts instantly so you never stop learning.",
                "cost": 50,
                "icon": "❤️",
                "badge": "Popular",
                "can_buy": user.hearts < user.max_hearts and user.gems >= 50 if user else False
            },
            {
                "id": "streak_freeze",
                "name": "Streak Freeze",
                "description": "Equip an icy shield that protects your streak if you miss a day.",
                "cost": 100,
                "icon": "❄️",
                "badge": "Equipped" if (user and user.has_streak_freeze) else "Available",
                "can_buy": (not user.has_streak_freeze) and user.gems >= 100 if user else False
            },
            {
                "id": "double_or_nothing",
                "name": "Double or Nothing",
                "description": "Maintain a 7-day streak to double your 50 gem wager!",
                "cost": 50,
                "icon": "💎",
                "badge": "Active",
                "can_buy": user.gems >= 50 if user else False
            },
            {
                "id": "super_duo",
                "name": "Super Duolingo (Mocked)",
                "description": "Unlimited hearts, practice hub, and personalized mistakes review.",
                "cost": 500,
                "icon": "⚡",
                "badge": "Special",
                "can_buy": user.gems >= 500 if user else False
            }
        ]
    }

@router.post("/buy")
def buy_shop_item(req: BuyItemRequest, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if req.item_id == "heart_refill":
        if user.gems < 50:
            raise HTTPException(status_code=400, detail="Not enough gems")
        user.gems -= 50
        user.hearts = user.max_hearts
        db.commit()
        return {"success": True, "message": "Hearts restored to 5/5!", "hearts": user.hearts, "gems": user.gems}

    elif req.item_id == "streak_freeze":
        if user.has_streak_freeze:
            return {"success": True, "message": "Streak Freeze is already active!", "gems": user.gems}
        if user.gems < 100:
            raise HTTPException(status_code=400, detail="Not enough gems")
        user.gems -= 100
        user.has_streak_freeze = True
        db.commit()
        return {"success": True, "message": "Streak Freeze equipped!", "gems": user.gems}

    elif req.item_id == "double_or_nothing":
        if user.gems < 50:
            raise HTTPException(status_code=400, detail="Not enough gems")
        user.gems -= 50
        db.commit()
        return {"success": True, "message": "Wager placed! Keep your streak for 7 days to win 100 gems.", "gems": user.gems}

    elif req.item_id == "super_duo":
        if user.gems < 500:
            raise HTTPException(status_code=400, detail="Not enough gems")
        user.gems -= 500
        user.hearts = 999
        user.max_hearts = 999
        db.commit()
        return {"success": True, "message": "Super Duolingo Activated! Unlimited hearts unlocked!", "hearts": user.hearts, "gems": user.gems}

    raise HTTPException(status_code=400, detail="Unknown item")
