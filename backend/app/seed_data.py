import json
from datetime import datetime
from sqlalchemy.orm import Session
from .models import User, Course, Unit, Skill, Lesson, Exercise, UserSkillProgress, Achievement, LeaderboardUser

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Course).first() is not None:
        return

    # 1. Create Default Learner
    user = User(
        username="duo_learner",
        name="Alex Rodriguez",
        avatar="🦉",
        total_xp=145,
        streak=5,
        hearts=5,
        max_hearts=5,
        gems=480,
        daily_goal_xp=30,
        today_xp=15,
        league="Silver",
        has_streak_freeze=True,
        last_active_date=datetime.utcnow().strftime("%Y-%m-%d")
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Create Course: Spanish
    course = Course(title="Spanish", flag="🇪🇸", code="es")
    db.add(course)
    db.commit()
    db.refresh(course)

    # 3. Create Unit 1
    unit1 = Unit(
        course_id=course.id,
        order_index=1,
        title="Order at a café",
        description="Order food, introduce yourself, and drink coffee",
        theme_color="#58cc02",
        guidebook_content="""### Unit 1 Key Vocabulary
- **¡Hola!**: Hello!
- **Buenos días**: Good morning
- **Por favor**: Please
- **Muchas gracias**: Thank you very much
- **Un café con leche**: A coffee with milk
- **La cuenta, por favor**: The check, please

### Grammar Tip
In Spanish, nouns have gender:
- *El* niño (the boy - masculine)
- *La* niña (the girl - feminine)
- *El* pan (the bread - masculine)
- *La* manzana (the apple - feminine)"""
    )
    db.add(unit1)

    # Unit 2: Greet people and say goodbye (Purple banner: #ce82ff)
    unit2 = Unit(
        course_id=course.id,
        order_index=2,
        title="Greet people and say goodbye",
        description="Greet people, introduce yourself, and say farewell",
        theme_color="#ce82ff",
        guidebook_content="""### Unit 2 Key Vocabulary
- **¡Buenas tardes!**: Good afternoon!
- **¡Buenas noches!**: Good evening / Good night!
- **¿Cómo estás?**: How are you?
- **Mucho gusto**: Nice to meet you
- **Hasta luego / Adiós**: See you later / Goodbye"""
    )
    db.add(unit2)

    # Unit 3: Say where you are from (Teal/Emerald banner: #00cd9c)
    unit3 = Unit(
        course_id=course.id,
        order_index=3,
        title="Say where you are from",
        description="Talk about countries, origins, and delicious foods",
        theme_color="#00cd9c",
        guidebook_content="""### Unit 3 Key Vocabulary
- **¿De dónde eres?**: Where are you from?
- **Soy de España / México**: I am from Spain / Mexico
- **Me gusta la comida mexicana**: I like Mexican food
- **Un taco y agua, por favor**: A taco and water, please"""
    )
    db.add(unit3)
    db.commit()
    db.refresh(unit1)
    db.refresh(unit2)
    db.refresh(unit3)

    # 4. Create Skills for Unit 1 (Order at a café)
    skills_u1_data = [
        {"order": 1, "title": "Order at a café", "icon": "star", "lessons": 3, "pos": 0},
        {"order": 2, "title": "Order at a café", "icon": "chat", "lessons": 3, "pos": -30},
        {"order": 3, "title": "Treasure Chest", "icon": "chest", "lessons": 1, "pos": -55},
        {"order": 4, "title": "Order at a café", "icon": "coffee", "lessons": 3, "pos": -35},
        {"order": 5, "title": "Order at a café", "icon": "star", "lessons": 3, "pos": 10},
        {"order": 6, "title": "Unit 1 review", "icon": "trophy", "lessons": 1, "pos": 20},
    ]

    u1_skills = []
    for s in skills_u1_data:
        skill = Skill(
            unit_id=unit1.id,
            order_index=s["order"],
            title=s["title"],
            icon=s["icon"],
            total_lessons=s["lessons"],
            position_x=s["pos"]
        )
        db.add(skill)
        u1_skills.append(skill)

    # Skills for Unit 2 (Greet people and say goodbye)
    # Pattern matching image 2: Fast-forward jump node, Star, Chest, Headset/audio, Star, Trophy
    skills_u2_data = [
        {"order": 1, "title": "Greet people and say goodbye", "icon": "fast_forward", "lessons": 3, "pos": 0},
        {"order": 2, "title": "Greet people and say goodbye", "icon": "star", "lessons": 3, "pos": 25},
        {"order": 3, "title": "Treasure Chest", "icon": "chest", "lessons": 1, "pos": 35},
        {"order": 4, "title": "Greet people and say goodbye", "icon": "headset", "lessons": 3, "pos": 20},
        {"order": 5, "title": "Greet people and say goodbye", "icon": "star", "lessons": 3, "pos": -10},
        {"order": 6, "title": "Unit 2 review", "icon": "trophy", "lessons": 1, "pos": -25},
    ]
    u2_skills = []
    for s in skills_u2_data:
        skill = Skill(
            unit_id=unit2.id,
            order_index=s["order"],
            title=s["title"],
            icon=s["icon"],
            total_lessons=s["lessons"],
            position_x=s["pos"]
        )
        db.add(skill)
        u2_skills.append(skill)

    # Skills for Unit 3 (Say where you are from / Cafe & Food)
    # Pattern matching image 1: Star, Chest, Headset, Star, Headset, Trophy
    skills_u3_data = [
        {"order": 1, "title": "Say where you are from", "icon": "star", "lessons": 3, "pos": 0},
        {"order": 2, "title": "Treasure Chest", "icon": "chest", "lessons": 1, "pos": -15},
        {"order": 3, "title": "Café & Food", "icon": "headset", "lessons": 3, "pos": -25},
        {"order": 4, "title": "Say where you are from", "icon": "star", "lessons": 3, "pos": 15},
        {"order": 5, "title": "Café & Food", "icon": "headset", "lessons": 3, "pos": 30},
        {"order": 6, "title": "Unit 3 review", "icon": "trophy", "lessons": 1, "pos": 5},
    ]
    u3_skills = []
    for s in skills_u3_data:
        skill = Skill(
            unit_id=unit3.id,
            order_index=s["order"],
            title=s["title"],
            icon=s["icon"],
            total_lessons=s["lessons"],
            position_x=s["pos"]
        )
        db.add(skill)
        u3_skills.append(skill)

    db.commit()
    for s in u1_skills:
        db.refresh(s)
    for s in u2_skills:
        db.refresh(s)
    for s in u3_skills:
        db.refresh(s)

    # 5. Add Lessons & Exercises for Unit 1: "Order at a café"
    # Unit 1 Skill 1: Café Basics (l1, l2, l3)
    u1_s1 = u1_skills[0]

    # Lesson 1 of Unit 1: Ordering Coffee & Tea
    l1_u1 = Lesson(skill_id=u1_s1.id, order_index=1, title="Coffee & Tea Basics", xp_reward=15)
    db.add(l1_u1)
    db.commit()
    db.refresh(l1_u1)

    exercises_l1 = [
        Exercise(
            lesson_id=l1_u1.id,
            order_index=1,
            type="match_pairs",
            prompt="Select the matching pairs",
            target_text="Café Vocabulary",
            audio_text="café, té, agua, leche, azúcar",
            data_json=json.dumps({
                "left": [
                    {"id": "p1", "text": "coffee"},
                    {"id": "p2", "text": "tea"},
                    {"id": "p3", "text": "water"},
                    {"id": "p4", "text": "milk"},
                    {"id": "p5", "text": "sugar"}
                ],
                "right": [
                    {"id": "p3", "text": "agua"},
                    {"id": "p4", "text": "leche"},
                    {"id": "p1", "text": "café"},
                    {"id": "p5", "text": "azúcar"},
                    {"id": "p2", "text": "té"}
                ]
            })
        ),
        Exercise(
            lesson_id=l1_u1.id,
            order_index=2,
            type="translate_word_bank",
            prompt="Write this in English",
            target_text="Un café con leche",
            audio_text="Un café con leche",
            data_json=json.dumps({
                "badge": "CAFÉ PHRASE",
                "phrase": "Un café con leche",
                "highlight_word": "café",
                "hint": "coffee",
                "solution": ["A", "coffee", "with", "milk"],
                "words": ["A", "coffee", "with", "milk", "tea", "bread", "water"]
            })
        ),
        Exercise(
            lesson_id=l1_u1.id,
            order_index=3,
            type="multiple_choice",
            prompt="Which of these is \"the coffee\"?",
            target_text="El café",
            audio_text="El café",
            data_json=json.dumps({
                "options": [
                    {"id": "1", "text": "El café", "subtext": "The coffee", "correct": True, "icon": "☕"},
                    {"id": "2", "text": "El té", "subtext": "The tea", "correct": False, "icon": "🍵"},
                    {"id": "3", "text": "El agua", "subtext": "The water", "correct": False, "icon": "💧"}
                ]
            })
        ),
        Exercise(
            lesson_id=l1_u1.id,
            order_index=4,
            type="fill_in_blank",
            prompt="Complete the sentence",
            target_text="Yo quiero un ___ por favor.",
            audio_text="Yo quiero un café por favor",
            data_json=json.dumps({
                "prefix": "Yo quiero un",
                "suffix": "por favor.",
                "solution": "café",
                "options": ["café", "somos", "buenas", "perro"],
                "translation": "I want a coffee please."
            })
        ),
        Exercise(
            lesson_id=l1_u1.id,
            order_index=5,
            type="type_answer",
            prompt="Write this in Spanish: \"The milk\"",
            target_text="The milk",
            audio_text="La leche",
            data_json=json.dumps({
                "solution": "La leche",
                "accepted": ["la leche", "La leche", "la leche.", "La leche."],
                "hint": "Noun begins with 'L' and is feminine."
            })
        )
    ]
    for ex in exercises_l1:
        db.add(ex)

    # Lesson 2 of Unit 1: Bread & Pastries at the Café
    l2_u1 = Lesson(skill_id=u1_s1.id, order_index=2, title="Food & Pastries", xp_reward=15)
    db.add(l2_u1)
    db.commit()
    db.refresh(l2_u1)

    exercises_l2 = [
        Exercise(
            lesson_id=l2_u1.id,
            order_index=1,
            type="multiple_choice",
            prompt="Which of these is \"the bread\"?",
            target_text="El pan",
            audio_text="El pan",
            data_json=json.dumps({
                "options": [
                    {"id": "1", "text": "El pan", "subtext": "The bread", "correct": True, "icon": "🍞"},
                    {"id": "2", "text": "El queso", "subtext": "The cheese", "correct": False, "icon": "🧀"},
                    {"id": "3", "text": "La manzana", "subtext": "The apple", "correct": False, "icon": "🍎"}
                ]
            })
        ),
        Exercise(
            lesson_id=l2_u1.id,
            order_index=2,
            type="translate_word_bank",
            prompt="Translate this sentence",
            target_text="Un sándwich de queso",
            audio_text="Un sándwich de queso",
            data_json=json.dumps({
                "phrase": "Un sándwich de queso",
                "solution": ["A", "cheese", "sandwich"],
                "words": ["A", "cheese", "sandwich", "bread", "coffee", "water"]
            })
        ),
        Exercise(
            lesson_id=l2_u1.id,
            order_index=3,
            type="match_pairs",
            prompt="Select matching café foods",
            target_text="Café Foods",
            audio_text="pan, queso, sándwich, jugo, cuenta",
            data_json=json.dumps({
                "left": [
                    {"id": "f1", "text": "bread"},
                    {"id": "f2", "text": "cheese"},
                    {"id": "f3", "text": "sandwich"},
                    {"id": "f4", "text": "juice"},
                    {"id": "f5", "text": "bill"}
                ],
                "right": [
                    {"id": "f3", "text": "sándwich"},
                    {"id": "f1", "text": "pan"},
                    {"id": "f5", "text": "cuenta"},
                    {"id": "f2", "text": "queso"},
                    {"id": "f4", "text": "jugo"}
                ]
            })
        ),
        Exercise(
            lesson_id=l2_u1.id,
            order_index=4,
            type="fill_in_blank",
            prompt="Complete the café request",
            target_text="La ___ por favor.",
            audio_text="La cuenta por favor",
            data_json=json.dumps({
                "prefix": "La",
                "suffix": "por favor.",
                "solution": "cuenta",
                "options": ["cuenta", "casa", "niña", "noche"],
                "translation": "The check please."
            })
        ),
        Exercise(
            lesson_id=l2_u1.id,
            order_index=5,
            type="type_answer",
            prompt="Write this in Spanish: \"The bread\"",
            target_text="The bread",
            audio_text="El pan",
            data_json=json.dumps({
                "solution": "El pan",
                "accepted": ["el pan", "El pan", "el pan.", "El pan."],
                "hint": "Masculine noun starting with 'p'."
            })
        )
    ]
    for ex in exercises_l2:
        db.add(ex)

    # Lesson 3 of Unit 1: Café Mastery
    l3_u1 = Lesson(skill_id=u1_s1.id, order_index=3, title="Café Mastery", xp_reward=20)
    db.add(l3_u1)
    db.commit()
    db.refresh(l3_u1)

    exercises_l3 = [
        Exercise(
            lesson_id=l3_u1.id,
            order_index=1,
            type="translate_word_bank",
            prompt="Translate this sentence",
            target_text="Un café solo y un pan, por favor",
            audio_text="Un café solo y un pan, por favor",
            data_json=json.dumps({
                "phrase": "Un café solo y un pan, por favor",
                "solution": ["A", "black", "coffee", "and", "a", "bread,", "please"],
                "words": ["A", "black", "coffee", "and", "a", "bread,", "please", "tea", "cheese"]
            })
        ),
        Exercise(
            lesson_id=l3_u1.id,
            order_index=2,
            type="type_answer",
            prompt="Write this in Spanish: \"A coffee please\"",
            target_text="A coffee please",
            audio_text="Un café por favor",
            data_json=json.dumps({
                "solution": "Un café por favor",
                "accepted": ["un café por favor", "Un café por favor", "Un café, por favor", "un café, por favor"],
                "hint": "Use 'un' for a masculine drink."
            })
        )
    ]
    for ex in exercises_l3:
        db.add(ex)

    # Unit 1 Skill 2: Café Dialogues & Orders
    u1_s2 = u1_skills[1]
    u1_s2_l1 = Lesson(skill_id=u1_s2.id, order_index=1, title="Ordering at the Counter", xp_reward=15)
    db.add(u1_s2_l1)
    db.commit()
    db.refresh(u1_s2_l1)

    exercises_u1_s2 = [
        Exercise(
            lesson_id=u1_s2_l1.id,
            order_index=1,
            type="multiple_choice",
            prompt="How do you ask for \"a table for two\"?",
            target_text="Una mesa para dos",
            audio_text="Una mesa para dos",
            data_json=json.dumps({
                "options": [
                    {"id": "1", "text": "Una mesa para dos", "subtext": "A table for two", "correct": True, "icon": "🪑"},
                    {"id": "2", "text": "Un café con leche", "subtext": "A coffee with milk", "correct": False, "icon": "☕"},
                    {"id": "3", "text": "La cuenta por favor", "subtext": "The check please", "correct": False, "icon": "🧾"}
                ]
            })
        ),
        Exercise(
            lesson_id=u1_s2_l1.id,
            order_index=2,
            type="translate_word_bank",
            prompt="Translate this sentence",
            target_text="Yo quiero agua con gas",
            audio_text="Yo quiero agua con gas",
            data_json=json.dumps({
                "phrase": "Yo quiero agua con gas",
                "solution": ["I", "want", "sparkling", "water"],
                "words": ["I", "want", "sparkling", "water", "tea", "coffee", "bread"]
            })
        ),
        Exercise(
            lesson_id=u1_s2_l1.id,
            order_index=3,
            type="type_answer",
            prompt="Write this in Spanish: \"The check, please\"",
            target_text="The check, please",
            audio_text="La cuenta, por favor",
            data_json=json.dumps({
                "solution": "La cuenta, por favor",
                "accepted": ["la cuenta, por favor", "La cuenta, por favor", "la cuenta por favor", "La cuenta por favor"],
                "hint": "Feminine word for check/bill is 'cuenta'."
            })
        )
    ]
    for ex in exercises_u1_s2:
        db.add(ex)

    # Unit 1 Skill 3: Treasure Chest
    chest_skill = u1_skills[2]
    c_l1 = Lesson(skill_id=chest_skill.id, order_index=1, title="Bonus Café Chest", xp_reward=25)
    db.add(c_l1)
    db.commit()
    db.refresh(c_l1)

    ex_chest = [
        Exercise(
            lesson_id=c_l1.id,
            order_index=1,
            type="translate_word_bank",
            prompt="Translate this phrase",
            target_text="Un café grande, por favor",
            audio_text="Un café grande, por favor",
            data_json=json.dumps({
                "phrase": "Un café grande, por favor",
                "solution": ["A", "large", "coffee,", "please"],
                "words": ["A", "large", "coffee,", "please", "water", "tea", "bread"]
            })
        ),
        Exercise(
            lesson_id=c_l1.id,
            order_index=2,
            type="fill_in_blank",
            prompt="Complete the sentence",
            target_text="El café está muy ___",
            audio_text="El café está muy rico",
            data_json=json.dumps({
                "prefix": "El café está muy",
                "suffix": ".",
                "solution": "rico",
                "options": ["rico", "casa", "niña", "perro"],
                "translation": "The coffee is very delicious."
            })
        )
    ]
    for ex in ex_chest:
        db.add(ex)

    # 6. Add Lessons & Exercises for Unit 2: "Greet people and say goodbye"
    u2_s1 = u2_skills[0] # Fast forward / first skill
    u2_l1 = Lesson(skill_id=u2_s1.id, order_index=1, title="Hello, Good Morning & Bye", xp_reward=15)
    db.add(u2_l1)
    db.commit()
    db.refresh(u2_l1)

    exercises_u2_l1 = [
        Exercise(
            lesson_id=u2_l1.id,
            order_index=1,
            type="match_pairs",
            prompt="Select the matching greetings",
            target_text="Greetings",
            audio_text="hola, buenos días, buenas noches, adiós, hasta luego",
            data_json=json.dumps({
                "left": [
                    {"id": "g1", "text": "hello"},
                    {"id": "g2", "text": "good morning"},
                    {"id": "g3", "text": "good night"},
                    {"id": "g4", "text": "goodbye"},
                    {"id": "g5", "text": "see you later"}
                ],
                "right": [
                    {"id": "g2", "text": "buenos días"},
                    {"id": "g4", "text": "adiós"},
                    {"id": "g1", "text": "hola"},
                    {"id": "g5", "text": "hasta luego"},
                    {"id": "g3", "text": "buenas noches"}
                ]
            })
        ),
        Exercise(
            lesson_id=u2_l1.id,
            order_index=2,
            type="multiple_choice",
            prompt="How do you say \"Good morning\"?",
            target_text="Buenos días",
            audio_text="Buenos días",
            data_json=json.dumps({
                "options": [
                    {"id": "1", "text": "Buenos días", "subtext": "Good morning", "correct": True, "icon": "🌅"},
                    {"id": "2", "text": "Buenas tardes", "subtext": "Good afternoon", "correct": False, "icon": "☀️"},
                    {"id": "3", "text": "Buenas noches", "subtext": "Good night", "correct": False, "icon": "🌙"}
                ]
            })
        ),
        Exercise(
            lesson_id=u2_l1.id,
            order_index=3,
            type="translate_word_bank",
            prompt="Translate this greeting",
            target_text="¡Mucho gusto, Juan!",
            audio_text="¡Mucho gusto, Juan!",
            data_json=json.dumps({
                "phrase": "¡Mucho gusto, Juan!",
                "solution": ["Nice", "to", "meet", "you,", "Juan!"],
                "words": ["Nice", "to", "meet", "you,", "Juan!", "morning", "Goodbye", "Please"]
            })
        ),
        Exercise(
            lesson_id=u2_l1.id,
            order_index=4,
            type="type_answer",
            prompt="Write this in Spanish: \"Goodbye\"",
            target_text="Goodbye",
            audio_text="Adiós",
            data_json=json.dumps({
                "solution": "Adiós",
                "accepted": ["adiós", "Adiós", "adios", "Adios", "¡Adiós!", "¡adios!"],
                "hint": "Word for saying farewell."
            })
        )
    ]
    for ex in exercises_u2_l1:
        db.add(ex)

    # 7. Add Lessons & Exercises for Unit 3: "Say where you are from"
    u3_s1 = u3_skills[0]
    u3_l1 = Lesson(skill_id=u3_s1.id, order_index=1, title="Countries and Origins", xp_reward=15)
    db.add(u3_l1)
    db.commit()
    db.refresh(u3_l1)

    exercises_u3_l1 = [
        Exercise(
            lesson_id=u3_l1.id,
            order_index=1,
            type="match_pairs",
            prompt="Match the countries and phrases",
            target_text="Origins",
            audio_text="España, México, Estados Unidos, de dónde, soy de",
            data_json=json.dumps({
                "left": [
                    {"id": "c1", "text": "Spain"},
                    {"id": "c2", "text": "Mexico"},
                    {"id": "c3", "text": "United States"},
                    {"id": "c4", "text": "where from"},
                    {"id": "c5", "text": "I am from"}
                ],
                "right": [
                    {"id": "c2", "text": "México"},
                    {"id": "c1", "text": "España"},
                    {"id": "c5", "text": "soy de"},
                    {"id": "c3", "text": "Estados Unidos"},
                    {"id": "c4", "text": "de dónde"}
                ]
            })
        ),
        Exercise(
            lesson_id=u3_l1.id,
            order_index=2,
            type="translate_word_bank",
            prompt="Translate this sentence",
            target_text="Yo soy de España",
            audio_text="Yo soy de España",
            data_json=json.dumps({
                "phrase": "Yo soy de España",
                "solution": ["I", "am", "from", "Spain"],
                "words": ["I", "am", "from", "Spain", "Mexico", "where", "living"]
            })
        ),
        Exercise(
            lesson_id=u3_l1.id,
            order_index=3,
            type="fill_in_blank",
            prompt="Complete the question",
            target_text="¿De dónde ___ tú?",
            audio_text="¿De dónde eres tú?",
            data_json=json.dumps({
                "prefix": "¿De dónde",
                "suffix": "tú?",
                "solution": "eres",
                "options": ["eres", "somos", "come", "bebe"],
                "translation": "Where are you from?"
            })
        ),
        Exercise(
            lesson_id=u3_l1.id,
            order_index=4,
            type="type_answer",
            prompt="Write this in Spanish: \"I am from Mexico\"",
            target_text="I am from Mexico",
            audio_text="Soy de México",
            data_json=json.dumps({
                "solution": "Soy de México",
                "accepted": ["soy de mexico", "Soy de mexico", "soy de México", "Soy de México", "Yo soy de México", "yo soy de mexico"],
                "hint": "Use 'Soy de...' for your origin."
            })
        )
    ]
    for ex in exercises_u3_l1:
        db.add(ex)

    # 8. User Progress initialization
    # Unit 1 Skill 1: 2/3 completed, unlocked
    p1 = UserSkillProgress(
        user_id=user.id,
        skill_id=u1_s1.id,
        completed_lessons=2,
        is_unlocked=True,
        is_completed=False,
        crown_level=1
    )
    # Unit 1 Skill 2: unlocked
    p2 = UserSkillProgress(
        user_id=user.id,
        skill_id=u1_s2.id,
        completed_lessons=0,
        is_unlocked=True,
        is_completed=False,
        crown_level=0
    )
    # Chest: locked until previous
    p3 = UserSkillProgress(
        user_id=user.id,
        skill_id=chest_skill.id,
        completed_lessons=0,
        is_unlocked=False,
        is_completed=False,
        crown_level=0
    )
    db.add_all([p1, p2, p3])

    # Other skills in Unit 1, Unit 2, and Unit 3 are locked
    for sk in u1_skills[3:] + u2_skills + u3_skills:
        db.add(UserSkillProgress(
            user_id=user.id,
            skill_id=sk.id,
            completed_lessons=0,
            is_unlocked=False,
            is_completed=False,
            crown_level=0
        ))

    # 9. Seed Achievements
    achievements = [
        Achievement(
            key="wildfire",
            title="Wildfire",
            description="Reach a 7 day streak",
            icon="flame",
            target_value=7,
            current_value=user.streak,
            is_unlocked=False,
            tier=1
        ),
        Achievement(
            key="sage",
            title="Sage",
            description="Earn 200 total XP",
            icon="zap",
            target_value=200,
            current_value=user.total_xp,
            is_unlocked=False,
            tier=1
        ),
        Achievement(
            key="scholar",
            title="Scholar",
            description="Complete 5 lessons",
            icon="book",
            target_value=5,
            current_value=3,
            is_unlocked=False,
            tier=1
        ),
        Achievement(
            key="sharpshooter",
            title="Sharpshooter",
            description="Finish a lesson without losing a single heart",
            icon="target",
            target_value=1,
            current_value=1,
            is_unlocked=True,
            tier=1
        ),
        Achievement(
            key="champion",
            title="Champion",
            description="Rank top 3 in your weekly leaderboard",
            icon="trophy",
            target_value=3,
            current_value=2,
            is_unlocked=True,
            tier=2
        )
    ]
    for ach in achievements:
        db.add(ach)

    # 10. Seed Leaderboard Users (Silver League)
    leaderboard_data = [
        {"name": "Junior", "avatar": "👦", "xp": 210, "is_current": False},
        {"name": "Alex Rodriguez (You)", "avatar": "🦉", "xp": 145, "is_current": True},
        {"name": "Bea", "avatar": "👧", "xp": 130, "is_current": False},
        {"name": "Vikram", "avatar": "👨‍🍳", "xp": 115, "is_current": False},
        {"name": "Lily", "avatar": "💜", "xp": 95, "is_current": False},
        {"name": "Lin", "avatar": "👵", "xp": 80, "is_current": False},
        {"name": "Eddy", "avatar": "🏃‍♂️", "xp": 65, "is_current": False},
        {"name": "Lucy", "avatar": "🕵️‍♀️", "xp": 50, "is_current": False},
        {"name": "Oscar", "avatar": "🎨", "xp": 40, "is_current": False},
        {"name": "Zari", "avatar": "🎀", "xp": 25, "is_current": False},
    ]
    for idx, lb in enumerate(leaderboard_data):
        db.add(LeaderboardUser(
            name=lb["name"],
            avatar=lb["avatar"],
            league="Silver",
            xp=lb["xp"],
            is_current_user=lb["is_current"]
        ))

    db.commit()
