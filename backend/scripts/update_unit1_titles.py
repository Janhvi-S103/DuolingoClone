import sqlite3

conn = sqlite3.connect("backend/duolingo.db")
cur = conn.cursor()
cur.execute("UPDATE skills SET title='Order at a café' WHERE unit_id=1")
conn.commit()
cur.execute("SELECT id, unit_id, order_index, title FROM skills WHERE unit_id=1")
print("Unit 1 skills updated:", cur.fetchall())
conn.close()
