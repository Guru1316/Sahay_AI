import sqlite3

DB_NAME = "cases.db"

def get_connection():
    return sqlite3.connect(DB_NAME, check_same_thread=False)

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender TEXT,
            message TEXT,
            need TEXT,
            urgency INTEGER,
            explanation TEXT,
            timestamp TEXT,
            status TEXT DEFAULT 'ACTIVE'
        )
    """)
    conn.commit()
    conn.close()

def insert_case(sender, message, need, urgency, explanation, timestamp):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO cases (sender, message, need, urgency, explanation, timestamp, status)
        VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
    """, (sender, message, need, urgency, explanation, timestamp))
    conn.commit()
    conn.close()

def fetch_cases():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM cases
        WHERE status='ACTIVE'
        ORDER BY urgency DESC
    """)
    rows = cur.fetchall()
    conn.close()
    return rows

def resolve_case(case_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE cases SET status='RESOLVED' WHERE id=?",
        (case_id,)
    )
    conn.commit()
    conn.close()
