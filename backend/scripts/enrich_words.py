import sqlite3
import json

def enrich():
    conn = sqlite3.connect("backend/duolingo.db")
    cur = conn.cursor()

    # 1. Update Lesson 1 of Basics 1 (skill_id = 1)
    # Exercise 1: Match Pairs (5 pairs)
    p_l1_ex1 = json.dumps({
        "left": [
            {"id": "p1", "text": "el hombre"},
            {"id": "p2", "text": "la mujer"},
            {"id": "p3", "text": "el niño"},
            {"id": "p4", "text": "la niña"},
            {"id": "p5", "text": "la manzana"}
        ],
        "right": [
            {"id": "p3", "text": "the boy"},
            {"id": "p1", "text": "the man"},
            {"id": "p5", "text": "the apple"},
            {"id": "p2", "text": "the woman"},
            {"id": "p4", "text": "the girl"}
        ]
    })
    cur.execute("UPDATE exercises SET prompt='Select the matching pairs', target_text='Basics matching', data_json=? WHERE lesson_id=1 AND order_index=1", (p_l1_ex1,))

    # Exercise 2: Translate word bank
    p_l1_ex2 = json.dumps({
        "phrase": "Yo soy un hombre",
        "solution": ["I", "am", "a", "man"],
        "words": ["I", "am", "a", "man", "woman", "boy", "drinks", "bread"]
    })
    cur.execute("UPDATE exercises SET prompt='Translate this sentence', target_text='Yo soy un hombre', audio_text='Yo soy un hombre', data_json=? WHERE lesson_id=1 AND order_index=2", (p_l1_ex2,))

    # 2. Update Lesson 2 of Basics 1 (skill_id = 1)
    # Exercise 2: Translate word bank
    p_l2_ex2 = json.dumps({
        "phrase": "El hombre bebe agua",
        "solution": ["The", "man", "drinks", "water"],
        "words": ["The", "man", "drinks", "water", "eats", "milk", "tea", "girl"]
    })
    cur.execute("UPDATE exercises SET prompt='Translate this sentence', target_text='El hombre bebe agua', audio_text='El hombre bebe agua', data_json=? WHERE lesson_id=2 AND order_index=2", (p_l2_ex2,))

    # 3. Update Lesson 3 of Basics 1 (skill_id = 1)
    # Exercise 1: Match Pairs (5 pairs)
    p_l3_ex1 = json.dumps({
        "left": [
            {"id": "p1", "text": "el pan"},
            {"id": "p2", "text": "la leche"},
            {"id": "p3", "text": "el agua"},
            {"id": "p4", "text": "la casa"},
            {"id": "p5", "text": "el perro"}
        ],
        "right": [
            {"id": "p2", "text": "the milk"},
            {"id": "p4", "text": "the house"},
            {"id": "p1", "text": "the bread"},
            {"id": "p5", "text": "the dog"},
            {"id": "p3", "text": "the water"}
        ]
    })
    cur.execute("UPDATE exercises SET prompt='Match the words', target_text='Basics review', data_json=? WHERE lesson_id=3 AND order_index=1", (p_l3_ex1,))

    # Exercise 2: Translate word bank
    p_l3_ex2 = json.dumps({
        "phrase": "Yo soy una mujer",
        "solution": ["I", "am", "a", "woman"],
        "words": ["I", "am", "a", "woman", "boy", "drinks", "is", "man"]
    })
    cur.execute("UPDATE exercises SET prompt='Translate this sentence', target_text='Yo soy una mujer', audio_text='Yo soy una mujer', data_json=? WHERE lesson_id=3 AND order_index=2", (p_l3_ex2,))

    # Check if Skill 2 (Greetings) has lessons
    cur.execute("SELECT id FROM skills WHERE order_index=2 AND unit_id=1")
    g_skill = cur.fetchone()
    if g_skill:
        g_skill_id = g_skill[0]
        # Check if lesson 2 of greetings exists
        cur.execute("SELECT id FROM lessons WHERE skill_id=? AND order_index=2", (g_skill_id,))
        if not cur.fetchone():
            cur.execute("INSERT INTO lessons (skill_id, order_index, title, xp_reward) VALUES (?, 2, 'Daily Courtesies', 15)", (g_skill_id,))
            l_id = cur.lastrowid
            # Add exercises
            ex1 = json.dumps({
                "left": [
                    {"id": "g1", "text": "hola"},
                    {"id": "g2", "text": "gracias"},
                    {"id": "g3", "text": "por favor"},
                    {"id": "g4", "text": "de nada"},
                    {"id": "g5", "text": "adiós"}
                ],
                "right": [
                    {"id": "g3", "text": "please"},
                    {"id": "g1", "text": "hello"},
                    {"id": "g5", "text": "goodbye"},
                    {"id": "g2", "text": "thank you"},
                    {"id": "g4", "text": "you're welcome"}
                ]
            })
            cur.execute("INSERT INTO exercises (lesson_id, order_index, type, prompt, target_text, audio_text, data_json) VALUES (?, 1, 'match_pairs', 'Match the greeting words', 'Greetings match', 'hola, gracias, por favor', ?)", (l_id, ex1))

            ex2 = json.dumps({
                "phrase": "Buenos días, mucho gusto",
                "solution": ["Good", "morning,", "nice", "to", "meet", "you"],
                "words": ["Good", "morning,", "nice", "to", "meet", "you", "night", "thanks", "hello"]
            })
            cur.execute("INSERT INTO exercises (lesson_id, order_index, type, prompt, target_text, audio_text, data_json) VALUES (?, 2, 'translate_word_bank', 'Translate this sentence', 'Buenos días, mucho gusto', 'Buenos días, mucho gusto', ?)", (l_id, ex2))

    # Set user progress on Skill 1 to 1 completed lesson (out of 3) so learner sees 33% progress bar, and completing lesson 2 takes it to 67%!
    cur.execute("UPDATE user_skill_progress SET completed_lessons=1, is_unlocked=1, is_completed=0 WHERE skill_id=1")
    cur.execute("UPDATE user_skill_progress SET completed_lessons=0, is_unlocked=1, is_completed=0 WHERE skill_id=2")

    conn.commit()
    conn.close()
    print("Enrichment complete!")

if __name__ == "__main__":
    enrich()
