# 🦉 Duolingo Web App Clone

A full-stack, pixel-perfect clone of the modern Duolingo web application. It replicates Duolingo's signature dark UI/UX design, playful gamified aesthetics, core lesson player loop, and progression systems.

Built for the **Duolingo SDE Fullstack Assignment**.

---

## 🌐 Live Deployments

- **Frontend App**: [https://duolingo-clone-two-smoky.vercel.app/](https://duolingo-clone-two-smoky.vercel.app/)
- **Backend API**: [https://duolingo-backend-t3lp.onrender.com](https://duolingo-backend-t3lp.onrender.com)
- **Interactive API Docs (Swagger)**: [https://duolingo-backend-t3lp.onrender.com/docs](https://duolingo-backend-t3lp.onrender.com/docs)
- **Backend Health Check**: [https://duolingo-backend-t3lp.onrender.com/api/health](https://duolingo-backend-t3lp.onrender.com/api/health)

---

## 🌟 Essential Features Implemented

### 1. Learning Path & Skill Tree (Exact Duolingo Home)
- **Signature Dark Theme**: Strict adherence to Duolingo design tokens (`#131f24` background, `#37464f` borders, `#58cc02` green, `#1cb0f6` blue).
- **Snake Path Progression**: Serpentine curved path of circular skill nodes with distinct states: *Completed* (golden/check), *Active* (elevated with glowing outer progress ring & floating animated `"START"` badge), and *Locked*.
- **Unit Header Banner**: Section label (`SECTION 1, UNIT 1`), title (`Order at a café`), and an interactive **`GUIDEBOOK`** modal containing key phrases and grammar tips.
- **Mascot Duo Flourishes**: Animated Duo the Owl standing on an oval pedestal cheering the user on.
- **Top Stats Bar**: Live indicators for Active Course (`🇪🇸 Spanish`), Streak Flame (`🔥`), Gems (`💎`), and Hearts (`❤️`).
- **Lesson Tooltip Popovers**: Clicking any skill node opens an interactive dialog showing lesson progress and a `"START +15 XP"` action button.

### 2. Full-Featured Lesson Player (The Core Loop)
Recreates the lesson engine supporting **all 5 required exercise types**:
1. **Multiple Choice**: 3D option cards with icons/subtext and keyboard shortcuts (`1`, `2`, `3`).
2. **Translate with Word Bank**: Interactive tiles you can tap into the answer sentence slot or tap to return.
3. **Match Pairs**: Bilingual tiles that highlight on select, turn green on match, and wobble red on mismatch.
4. **Fill in the Blank**: Sentence with dynamic blanks and selectable word bank options.
5. **Type the Answer**: Freeform text input with special Spanish accent helper buttons (`á`, `é`, `í`, `ó`, `ú`, `ñ`, `¿`, `¡`).

### 3. Audio Engine, TTS & Feedback
- **Duolingo Bottom Feedback Bar**:
  - **Correct**: Light green bar with checkmark circle, motivational phrase, and green 3D `"CONTINUE"` button (`Enter` key shortcut).
  - **Incorrect**: Light red bar with cross circle, correct solution reveal, and red 3D `"GOT IT"` button.
- **Synthesized Audio Engine**: Zero external audio file dependencies! Custom sound synthesis via the **Web Audio API** producing authentic two-tone correct chimes, error buzzes, tap clicks, and completion fanfare.
- **Text-to-Speech (TTS)**: Integrated `window.speechSynthesis` with native Spanish pronunciation and interactive audio speaker buttons.
- **Celebration Screen**: Dynamic confetti explosion via `canvas-confetti` upon lesson completion, featuring XP breakdown, accuracy stats, and streak progression.

### 4. Gamification, Progression & Economy
- **Hearts System**: 5 hearts maximum. Losing all hearts prompts the *"Out of Hearts"* modal, allowing gem refills (50 gems) or practice mode.
- **Weekly Leaderboard**: Silver League standings with promotion zone (top 3) and demotion zone indicators across 10 dynamically updated competitors.
- **Daily Quests & Milestones**: Daily quest tracking (e.g., Earn 10 XP, Complete 1 lesson) with chest rewards, alongside achievements (*Wildfire*, *Sage*, *Scholar*, *Sharpshooter*, *Champion*).
- **In-App Shop**: Purchase Heart Refills, Streak Freezes, and Double or Nothing wagers with real-time gem deductions and inventory state.

---

## 🧪 Interactive Evaluator & Demo Features (Streak Testing)

To simplify testing and grading without waiting 24 real-world hours, an **Evaluator Demo Panel** is integrated into the right sidebar and profile page:

| Demo Feature | Action & Verification |
|---|---|
| **🔥 Simulate Next Day (Streak Testing)** | Advances the simulated calendar day. If the user earned XP today, the streak increases by +1 and marks today completed. If no XP was earned, it tests **Streak Freeze protection** (consumes a freeze if owned) or resets the streak to 0. |
| **❤️ Instant Heart Refill** | Instantly restores health to 5/5 hearts to resume testing without spending gems. |
| **🔄 Reset Demo State** | Restores the default seeded state (Unit 1, Lesson 3 active, 3-day streak, 450 gems, 4 hearts) for clean, repeatable evaluation. |
| **⌨️ Keyboard Shortcuts** | Use `1`-`9` to pick options, `Enter` to check/continue, and `Backspace` to undo word bank selections. |

---

## 🛠️ Tech Stack

- **Frontend**: 
  - **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
  - **Language**: TypeScript
  - **Styling**: Vanilla CSS (Duolingo Design System tokens, 3D button animations, glassmorphism)
  - **Icons & Effects**: `lucide-react`, `canvas-confetti`
  - **Audio**: Web Audio API (synthesized tones) + Web Speech API (`es-ES` TTS)
- **Backend**:
  - **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
  - **Server**: Uvicorn ASGI
  - **Data Validation**: Pydantic v2
- **Database & ORM**:
  - **Database**: SQLite (local/Render) with PostgreSQL compatibility
  - **ORM**: SQLAlchemy 2.0 with automated startup table generation and data seeding
- **Deployment & Hosting**:
  - **Frontend**: [Vercel](https://vercel.com)
  - **Backend**: [Render](https://render.com)

---

## 🏗️ Architecture Overview

```
DuolingoClone/
├── backend/
│   ├── app/
│   │   ├── database.py       # Engine, SessionLocal, Base, DATABASE_URL config
│   │   ├── models.py         # SQLAlchemy Models (User, Course, Unit, Skill, Lesson, Exercise, etc.)
│   │   ├── schemas.py        # Pydantic Request & Response Schemas
│   │   ├── seed_data.py      # Seed generator for Spanish course & Silver League
│   │   ├── main.py           # FastAPI entrypoint, CORS middleware, auto-seeding
│   │   └── routers/          # Modular API routers
│   │       ├── user.py       # User profile, stats, streak rollover, hearts refill
│   │       ├── course.py     # Course & unit tree with completion states
│   │       ├── lessons.py    # Lesson session initialization & completion submission
│   │       ├── leaderboard.py# Weekly league standings & ranking calculation
│   │       ├── achievements.py# Daily quests & achievement badges
│   │       └── shop.py       # Power-up items & purchase handling
│   ├── requirements.txt      # Python dependencies
│   ├── run.py                # Server launcher script
│   └── .env.example          # Backend environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css   # Duolingo dark theme design tokens & 3D buttons
│   │   │   ├── layout.tsx    # Root layout with responsive viewports & metadata
│   │   │   ├── page.tsx      # Main Home Learning Path / Snake Skill Tree
│   │   │   ├── lesson/       # Fullscreen Lesson Player (all 5 exercise types)
│   │   │   ├── leaderboard/  # Weekly League Standings
│   │   │   ├── quests/       # Daily Quests & Milestones
│   │   │   ├── shop/         # Power-ups & Heart Refills Store
│   │   │   └── profile/      # User Stats & SDE Evaluator Control Panel
│   │   ├── components/       # Reusable components (Sidebar, TopBar, RightSidebar, MascotDuo, Modals)
│   │   └── utils/            # API client (api.ts) & Web Audio Synthesizer (sound.ts)
│   ├── package.json
│   └── .env.example          # Frontend environment variables template
│
└── README.md
```

---

## 🗄️ Database Schema

```
 +--------------------+       +--------------------+       +--------------------+
 |       Course       |       |        Unit        |       |       Skill        |
 +--------------------+       +--------------------+       +--------------------+
 | id: int (PK)       | 1---N | id: int (PK)       | 1---N | id: int (PK)       |
 | title: str         |       | course_id: int(FK) |       | unit_id: int(FK)   |
 | flag: str          |       | order_index: int   |       | title: str         |
 | code: str          |       | title: str         |       | icon: str          |
 +--------------------+       | description: str   |       | total_lessons: int |
                              | guidebook: text    |       | position_x: int    |
                              | theme_color: str   |       +--------------------+
                              +--------------------+                 | 1
                                                                     |
                                                                     | N
 +--------------------+       +--------------------+       +--------------------+
 |      Exercise      |       |       Lesson       |       |  UserSkillProgress |
 +--------------------+       +--------------------+       +--------------------+
 | id: int (PK)       | N---1 | id: int (PK)       |       | id: int (PK)       |
 | lesson_id: int(FK) |       | skill_id: int(FK)  |       | user_id: int(FK)   |
 | type: str          |       | title: str         |       | skill_id: int(FK)  |
 | prompt: str        |       | xp_reward: int     |       | completed: int     |
 | data_json: text    |       +--------------------+       | is_unlocked: bool  |
 +--------------------+                                    | is_completed: bool |
                                                           | crown_level: int   |
                                                           +--------------------+

 +--------------------+       +--------------------+       +--------------------+
 |        User        |       |     DailyQuest     |       |      ShopItem      |
 +--------------------+       +--------------------+       +--------------------+
 | id: int (PK)       |       | id: int (PK)       |       | id: int (PK)       |
 | username: str      |       | title: str         |       | name: str          |
 | hearts: int (max 5)|       | xp_reward: int     |       | cost_gems: int     |
 | gems: int          |       | target_count: int  |       | icon: str          |
 | streak: int        |       +--------------------+       | item_type: str     |
 | streak_freezes: int|                                    +--------------------+
 | last_active_date   |
 +--------------------+
```

---

## 📌 Assumptions Made

1. **Lightweight Standalone Persistence**: Uses SQLite by default with automated table creation and sample data seeding on initial startup, avoiding cumbersome external database configuration for evaluation. PostgreSQL connection strings (`DATABASE_URL`) are also supported.
2. **Zero-Latency Audio & TTS**: To avoid external API rate limits, API keys, or quota expiration (e.g. OpenAI / ElevenLabs), sound effects are generated mathematically using the **Web Audio API**, and voice reading uses the browser-native **Web Speech API** (`es-ES`).
3. **Single-User Evaluator Context**: The backend operates on an active learner profile seeded with realistic initial progress so evaluators can immediately test all features without having to register or grind through multiple units first.

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.10+
- **Git**

### 2. Backend Setup
```bash
cd backend

# 1. Create a virtual environment
python -m venv venv

# 2. Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the FastAPI development server
python run.py
```
The backend will be running at [http://127.0.0.1:8000](http://127.0.0.1:8000) with API docs at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 3. Frontend Setup
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. (Optional) Configure environment variable if pointing to local backend
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# 3. Start the Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
