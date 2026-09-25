from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, default="duo_learner")
    name = Column(String, default="Alex Rodriguez")
    avatar = Column(String, default="duo-avatar")
    total_xp = Column(Integer, default=145)
    streak = Column(Integer, default=5)
    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    gems = Column(Integer, default=480)
    daily_goal_xp = Column(Integer, default=30)
    today_xp = Column(Integer, default=15)
    league = Column(String, default="Silver")
    has_streak_freeze = Column(Boolean, default=True)
    last_active_date = Column(String, default=datetime.utcnow().strftime("%Y-%m-%d"))
    created_at = Column(DateTime, default=datetime.utcnow)

    progress = relationship("UserSkillProgress", back_populates="user", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    flag = Column(String, default="🇪🇸")
    code = Column(String, default="es")

    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    order_index = Column(Integer, default=1)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    guidebook_content = Column(Text, nullable=True)
    theme_color = Column(String, default="#58cc02")

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan", order_by="Skill.order_index")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    order_index = Column(Integer, default=1)
    title = Column(String, nullable=False)
    icon = Column(String, default="star")  # star, book, coffee, chat, plane, chest, trophy
    total_lessons = Column(Integer, default=3)
    position_x = Column(Integer, default=0) # horizontal curve offset: -45, -20, 0, 20, 45

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan", order_by="Lesson.order_index")
    progress = relationship("UserSkillProgress", back_populates="skill", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    order_index = Column(Integer, default=1)
    title = Column(String, nullable=False)
    xp_reward = Column(Integer, default=15)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan", order_by="Exercise.order_index")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    order_index = Column(Integer, default=1)
    type = Column(String, nullable=False) # multiple_choice, translate_word_bank, match_pairs, fill_in_blank, type_answer
    prompt = Column(String, nullable=False)
    target_text = Column(String, nullable=True)
    audio_text = Column(String, nullable=True)
    data_json = Column(Text, nullable=False) # JSON payload tailored for the exercise type

    lesson = relationship("Lesson", back_populates="exercises")

class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    completed_lessons = Column(Integer, default=0)
    is_unlocked = Column(Boolean, default=False)
    is_completed = Column(Boolean, default=False)
    crown_level = Column(Integer, default=0)

    user = relationship("User", back_populates="progress")
    skill = relationship("Skill", back_populates="progress")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon = Column(String, default="flame")
    target_value = Column(Integer, default=7)
    current_value = Column(Integer, default=0)
    is_unlocked = Column(Boolean, default=False)
    tier = Column(Integer, default=1)

class LeaderboardUser(Base):
    __tablename__ = "leaderboard_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=False)
    league = Column(String, default="Silver")
    xp = Column(Integer, default=0)
    is_current_user = Column(Boolean, default=False)
