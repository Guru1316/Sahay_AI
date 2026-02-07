from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from datetime import datetime
from urllib.parse import parse_qs

from engine.ai_engine import analyze_message, extract_phone_from_message
from db.database import init_db, insert_case, fetch_cases, resolve_case

from engine.groq_chat import groq_chat_answer



app = FastAPI()
init_db()

app.mount("/static", StaticFiles(directory="static"), name="static")

# ------------------------
# SMS INGESTION
# ------------------------
@app.post("/sms")
async def receive_sms(request: Request):
    sender = "Unknown"
    message = ""

    content_type = request.headers.get("content-type", "").lower()

    if "application/json" in content_type:
        data = await request.json()
        message = data.get("message", "")
        sender = data.get("sender", "Unknown")

    elif "application/x-www-form-urlencoded" in content_type:
        body = (await request.body()).decode("utf-8")
        data = parse_qs(body)
        message = data.get("message", [""])[0]
        sender = data.get("sender", ["Unknown"])[0]

    else:
        message = (await request.body()).decode("utf-8").strip()

    extracted_phone, clean_message = extract_phone_from_message(message)

    if sender == "Unknown" and extracted_phone:
        sender = extracted_phone

    message = clean_message

    if not message:
        return {"error": "Empty message"}

    result = analyze_message(message)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    insert_case(
        sender,
        message,
        result["need"],
        result["urgency"],
        result["explanation"],
        timestamp
    )

    return {"status": "SMS processed"}

# ------------------------
# FETCH ACTIVE CASES
# ------------------------
@app.get("/cases")
def get_cases():
    rows = fetch_cases()
    return [
        {
            "id": r[0],
            "sender": r[1],
            "message": r[2],
            "need": r[3],
            "urgency": r[4],
            "explanation": r[5],
            "time": r[6],
            "status": r[7]
        }
        for r in rows
    ]

# ------------------------
# MARK CASE AS RESOLVED
# ------------------------
@app.post("/resolve/{case_id}")
def mark_resolved(case_id: int):
    resolve_case(case_id)
    return {"status": "resolved"}


@app.post("/groq-chat")
async def groq_chat(request: Request):
    try:
        data = await request.json()
        question = data.get("question", "").strip()

        if not question:
            return {"answer": "Please ask a disaster-related question."}

        answer = groq_chat_answer(question)

        return {
            "answer": answer
        }

    except Exception as e:
        return {
            "answer": "I can only help with disaster response information."
        }
