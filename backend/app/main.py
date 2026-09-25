from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routers import user, course, lessons, leaderboard, achievements, shop

# Initialize SQLite tables
Base.metadata.create_all(bind=engine)

# Seed database on startup if empty
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="Duolingo Clone API",
    description="Full-featured Duolingo clone backend with learning path, lessons, gamification, and progress tracking.",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(user.router)
app.include_router(course.router)
app.include_router(lessons.router)
app.include_router(leaderboard.router)
app.include_router(achievements.router)
app.include_router(shop.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Duolingo Clone Backend API"}
