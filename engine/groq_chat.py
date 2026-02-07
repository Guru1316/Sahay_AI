import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

def groq_chat_answer(question: str) -> str:
    if not GROQ_API_KEY:
        return "Groq API key not configured."

    try:
        response = requests.post(
            GROQ_ENDPOINT,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",   # ✅ MOST COMPATIBLE
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are a disaster response assistant. "
                            "You can ONLY answer questions related to:\n"
                            "- Disasters\n"
                            "- Emergency response departments\n"
                            "- Rescue equipment and warehouses\n\n"
                            "If the question is outside this scope, reply exactly:\n"
                            "'I can only help with disaster response information.'"
                        )
                    },
                    {"role": "user", "content": question}
                ],
                "temperature": 0.2,
                "max_tokens": 200
            },
            timeout=15
        )

        if response.status_code != 200:
            return f"Groq API error ({response.status_code})"

        data = response.json()
        return data["choices"][0]["message"]["content"].strip()

    except Exception as e:
        return "Unable to answer right now. Please try again."
