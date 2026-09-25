# Duolingo Web App Clone

A full-stack clone of the modern Duolingo web application, replicating Duolingo's dark UI/UX design, playful gamified aesthetics, core lesson player loop, and gamification workflows.

Built for the **Duolingo SDE Fullstack Assignment**.

---

## 🌟 Key Features

### 1. Learning Path / Skill Tree (Exact Duolingo Home Path)
- **Pixel-Perfect Dark Theme**: `#131f24` background, `#37464f` borders, signature `#58cc02` green accents.
- **Snake Path Progression**: Serpentine path of circular skill nodes with lock/unlock states.
- **Active Node Indicators**: Floating animated `"START"` badge, glowing dark green outer progress ring, and 3D elevation.
- **Unit Header Banner**: Section tag (`← SECTION 1, UNIT 1`), title (`Order at a café`), and interactive `GUIDEBOOK` popover modal.
- **Mascot Flourishes**: Duo the owl standing beside the path on an oval pedestal/shadow, cheering the learner on.
- **Top Bar Stats**: Course flag (`🇪🇸 1`), Streak flame (`🔥`), Gems diamond (`💎`), and Hearts counter (`❤️`).
- **Interactive Tooltip Popovers**: Clicking any node opens a lesson preview dialog with lesson progress and a `"START +15 XP"` button.

### 2. Full-Featured Lesson Player (The Core Loop)
Recreates the lesson player with **all 5 required exercise types**:
1. **Multiple Choice**: 3D option cards with icons/subtext and keyboard shortcuts `1`, `2`, `3`.
2. **Translate with Word Bank**: Tap tiles from the word pool into the answer slot, or tap them in the answer slot to return them.
3. **Match Pairs**: Bilingual tiles that highlight on select, turn green on match, and wobble red on mismatch.
4. **Fill in the Blank**: Sentence with dynamic fill-in slot and selectable option tiles.
5. **Type the Answer**: Freeform text input with special Spanish accent buttons (`á`, `é`, `í`, `ó`, `ú`, `ñ`, `¿`, `¡`).

### 3. Iconic Feedback & Audio Engine
- **Duolingo Bottom Feedback Bar**:
  - **Correct**: Light green bar with checkmark circle, motivational quote, and big green 3D `"CONTINUE"` button (Enter key shortcut).
  - **Incorrect**: Light red bar with cross circle, correct solution reveal, and red 3D `"GOT IT"` button.
- **Web Audio API Sound Engine**: Custom synthesized Duolingo tones (two-tone correct chime, incorrect buzz thud, click tap, and victory fanfare) with zero external audio file dependencies.
- **Text-to-Speech (TTS)**: Built-in `window.speechSynthesis` with native Spanish pronunciation and audio speaker buttons.
- **Celebration Confetti**: Dynamic particle explosion via `canvas-confetti` upon lesson completion, featuring XP gain, accuracy percentage, and streak counter.

### 4. Gamification & Progression
- **Hearts System**: 5 hearts max. Lose 1 heart on a wrong answer. Triggers the *"Out of Hearts"* modal when depleted, offering gem refills (50 gems) or practice mode.
- **Streak Logic & Simulation**: Increments on daily lesson activity. Includes an SDE Evaluator Control to test next-day rollover and streak advancement.
- **Weekly Leaderboard**: Silver League standings with promotion zone (top 3) and demotion zone indicators across 10 seeded competitors.
- **Daily Quests & Badges**: Tracks daily XP goals (e.g. 10/10 XP with chest reward) and unlocks achievements (*Wildfire*, *Sage*, *Scholar*, *Sharpshooter*, *Champion*).
- **In-App Shop**: Purchase Heart Refills, Streak Freezes, and Double or Nothing wagers with real-time gem deductions.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Vanilla CSS (Duolingo Design System), `lucide-react`, `canvas-confetti`.
- **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic v2.
- **Database**: SQLite (SQLAlchemy 2.0 ORM) with relational schema and automated database seeding on startup.
- **Audio & TTS**: Web Audio API (synthetic chimes) + Web Speech API (`es-ES` TTS).

---

## 🏗️ Architecture & Database Schema

```
DuolingoClone/
├── backend/
│   ├── app/
│   │   ├── database.py       # Engine, SessionLocal, Base, DATABASE_URL config
│   │   ├── models.py         # SQLAlchemy ORM Models (User, Unit, Skill, Lesson, Exercise, etc.)
│   │   ├── schemas.py        # Pydantic Request & Response Schemas
│   │   ├── seed_data.py      # Seed data generator for Spanish Course & Silver League
│   │   ├── main.py           # FastAPI entrypoint, CORS middleware, auto-seeding
│   │   └── routers/          # Modular API endpoints (user, course, lessons, leaderboard, shop, achievements)
│   ├── requirements.txt      # Python dependencies
│   ├── run.py                # Server runner script
│   └── .env.example          # Backend environment template
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css   # Pixel-perfect Duolingo dark theme design tokens & 3D buttons
│   │   │   ├── layout.tsx    # Root layout with Nunito font and metadata
│   │   │   ├── page.tsx      # Main Home Path / Snake Skill Tree
│   │   │   ├── lesson/       # Fullscreen Lesson Player (all 5 exercise types)
│   │   │   ├── leaderboard/  # Weekly League Standings
│   │   │   ├── quests/       # Daily Quests & Milestones
│   │   │   ├── shop/         # Power-ups & Heart Refills Store
│   │   │   └── profile/      # Learner Stats & SDE Evaluator Control Panel
│   │   ├── components/       # Reusable components (Sidebar, TopBar, RightSidebar, MascotDuo, Modals)
│   │   └── utils/            # API client (api.ts) & Web Audio Synthesizer (sound.ts)
│   ├── package.json
│   └── .env.example          # Frontend environment template
│
└── README.md
```

### Relational Schema Diagram

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
```

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **Python** (3.10+)

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server (runs on http://127.0.0.1:8000)
python run.py
```
> **Note**: Database creation and initial course seeding occurs automatically on first run.

### 3. Frontend Setup
```bash
cd frontend

# Install npm dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Manual Production Deployment Guide

When deploying to production (e.g., **Vercel** for Frontend + **Render / Railway** for Backend), follow these manual steps to avoid production issues:

### 1. Backend Environment Variables
| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | Optional | Connection string. If omitted, uses local persistent SQLite `duolingo.db`. In PostgreSQL, provide your connection URI. | `postgresql://user:pass@ep-xyz.render.com/duolingo` |
| `PORT` | Optional | Port for the web service (Render/Railway sets this automatically). | `8000` |

### 2. Frontend Environment Variables
| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** in Production | The public URL of your deployed FastAPI backend. | `https://duolingo-clone-backend.onrender.com` |

### 3. CORS Configuration
In `backend/app/main.py`, CORS is pre-configured with `allow_origins=["*"]`, allowing your Vercel deployment domain to communicate seamlessly with your backend without cross-origin blocks.

### 4. Zero External API Keys Needed
- **Speech Synthesis**: Uses browser-native Web Speech API (`SpeechSynthesisUtterance`).
- **Sound Effects**: Uses browser-native Web Audio API (`AudioContext`) to synthesize tones dynamically.
- No third-party API keys (OpenAI, ElevenLabs, etc.) are required, ensuring zero API quota limits and zero hosting costs.

---

## 🧪 SDE Evaluator & Demo Panel

An embedded **Evaluator Control Panel** is provided in the right sidebar and profile page:
1. **Next Day**: Advances the simulated day counter. If the user earned XP today, streak increments by 1; otherwise, it tests streak freeze protection or streak reset.
2. **Refill Hearts**: Restores hearts to 5/5 immediately.
3. **Reset Demo**: Restores initial seeded state (Unit 1, Lesson 3 active) for clean re-evaluation.
