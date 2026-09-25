from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class UserBase(BaseModel):
    username: str
    name: str
    avatar: str
    total_xp: int
    streak: int
    hearts: int
    max_hearts: int
    gems: int
    daily_goal_xp: int
    today_xp: int
    league: str
    has_streak_freeze: bool
    last_active_date: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class ExerciseResponse(BaseModel):
    id: int
    lesson_id: int
    order_index: int
    type: str
    prompt: str
    target_text: Optional[str] = None
    audio_text: Optional[str] = None
    data: Dict[str, Any]

class LessonResponse(BaseModel):
    id: int
    skill_id: int
    order_index: int
    title: str
    xp_reward: int
    exercises: List[ExerciseResponse]

    class Config:
        from_attributes = True

class SkillPathItem(BaseModel):
    id: int
    unit_id: int
    order_index: int
    title: str
    icon: str
    total_lessons: int
    position_x: int
    completed_lessons: int
    is_unlocked: bool
    is_completed: bool
    crown_level: int

class UnitPathItem(BaseModel):
    id: int
    order_index: int
    title: str
    description: str
    guidebook_content: Optional[str] = None
    theme_color: str
    skills: List[SkillPathItem]

class CoursePathResponse(BaseModel):
    course: Dict[str, Any]
    units: List[UnitPathItem]
    user: UserResponse

class LessonCompleteRequest(BaseModel):
    hearts_remaining: int = 5
    accuracy: int = 100
    time_taken_seconds: int = 60

class LessonCompleteResponse(BaseModel):
    success: bool
    xp_awarded: int
    new_total_xp: int
    today_xp: int
    new_streak: int
    hearts: int
    skill_completed: bool
    next_skill_unlocked: bool
    message: str

class RefillHeartsResponse(BaseModel):
    success: bool
    hearts: int
    gems: int
    message: str

class SimulateDayResponse(BaseModel):
    success: bool
    streak: int
    today_xp: int
    last_active_date: str
    message: str

class ResetProgressResponse(BaseModel):
    success: bool
    message: str

class AchievementItem(BaseModel):
    id: int
    key: str
    title: str
    description: str
    icon: str
    target_value: int
    current_value: int
    is_unlocked: bool
    tier: int

    class Config:
        from_attributes = True

class LeaderboardItem(BaseModel):
    id: int
    name: str
    avatar: str
    league: str
    xp: int
    is_current_user: bool
    rank: int

    class Config:
        from_attributes = True
