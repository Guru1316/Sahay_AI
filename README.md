# 🚨 SAHAY.AI – Crisis Response Intelligence System

**SAHAY.AI** is an AI-assisted, human-in-the-loop crisis response system designed specifically for **low-resource, high-stress emergency environments**. It bridges the gap between victims sending SMS distress signals and emergency dispatchers by providing real-time analysis, prioritization, and an actionable dashboard.

---

## 🧠 Core Idea

During disasters, network stability is often low, leading victims to send **short, unstructured, high-stress SMS messages**. 
SAHAY.AI converts these raw messages into **actionable, prioritized crisis cases** using explainable AI. The system follows a strict **Human-in-the-Loop** philosophy: AI suggests urgency, but humans make the final rescue decisions.

---

## ✨ Key Features

* 📱 **SMS-based Intake**: Uses Android + MacroDroid to bridge cellular SMS to the cloud.
* 🧠 **Explainable AI**: Rule-based engine for urgency scoring (No "black-box" mystery).
* 📊 **Real-time Dashboard**: Automated priority ranking (High/Medium/Low) for dispatchers.
* 👤 **Human-in-the-Loop**: Mandatory manual verification for case resolution.
* 🔍 **Smart Filtering**: Search and filter active cases by sender, message, or urgency.
* 🤖 **Restricted AI Assistant**: Integrated Groq-powered chat for disaster-specific queries (equipment, protocols, locations).
* 🪶 **Low-Resource Design**: Fully free tech stack, lightweight, and easy to deploy.

---

## 🏗️ System Architecture



1.  **Victim (SMS)** sends a distress message.
2.  **Android Phone** receives the SMS; **MacroDroid** triggers an HTTP POST request.
3.  **FastAPI Backend** processes the data.
4.  **AI Engine** calculates urgency and stores the case in **SQLite**.
5.  **Web Dashboard** displays the case to a **Human Dispatcher** for action.

---

## 🧱 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **SMS Gateway** | Android Phone + MacroDroid |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI Intelligence** | Custom Rule Engine + Groq API (Llama-3.1-8b) |
| **Database** | SQLite |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Deployment** | Render (Free Tier) |

---

## ⚙️ Project Structure

```text
Sahay_AI/
│
├── main.py              # Entry point & API routes
├── requirements.txt     # Project dependencies
├── .env                 # Environment variables (API Keys)
├── .gitignore           # Git ignore rules
│
├── engine/
│   ├── ai_engine.py     # Rule-based scoring logic
│   └── groq_chat.py     # Disaster-support AI agent
│
├── db/
│   ├── database.py      # SQLAlchemy/SQLite setup
│   └── cases.db         # Local database file
│
├── static/
│   ├── index.html       # Main Dashboard
│   ├── style.css        # Dashboard Styling
│   ├── app.js           # Frontend Logic & API polling
│   └── departments.html # Resource info page
│
└── README.md            # Documentation
