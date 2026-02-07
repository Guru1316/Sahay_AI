import re

def extract_phone_from_message(message: str):
    """
    Extract phone number if present at the end of the message.
    Supports +91XXXXXXXXXX or XXXXXXXXXX
    """
    pattern = r'(\+91[\d]{10}|[\d]{10})$'
    match = re.search(pattern, message.strip())
    if match:
        phone = match.group(1)
        clean_message = message.replace(phone, "").strip()
        return phone, clean_message
    return None, message


def analyze_message(message: str):
    msg = message.lower()

    urgency = 0
    reasons = []

    # 🔥 STRONG URGENCY SIGNALS (CRITICAL)
    if any(w in msg for w in [
        "very urgent", "immediately", "right now", "asap", "emergency"
    ]):
        urgency += 35
        reasons.append("Extreme urgency language")

    # Explicit distress
    if any(w in msg for w in ["help", "pls", "please", "save"]):
        urgency += 15
        reasons.append("Explicit distress request")

    # Life-threatening situations
    if any(w in msg for w in [
        "trapped", "stuck", "cannot move", "cant escape", "inside house"
    ]):
        urgency += 30
        reasons.append("People trapped")

    # Disaster indicators
    if any(w in msg for w in [
        "flood", "water rising", "water inside", "inundated", "overflow"
    ]):
        urgency += 25
        reasons.append("Active flood condition")

    # Fire / structural danger
    if any(w in msg for w in [
        "fire", "collapse", "building cracking", "roof falling"
    ]):
        urgency += 35
        reasons.append("Structural danger")

    # Vulnerable groups
    if any(w in msg for w in ["child", "children", "kids", "baby"]):
        urgency += 25
        reasons.append("Children involved")

    if any(w in msg for w in ["old", "elderly", "pregnant", "disabled"]):
        urgency += 20
        reasons.append("Highly vulnerable individuals")

    # Resource deprivation
    if any(w in msg for w in [
        "no food", "hungry", "starving", "no water", "thirsty"
    ]):
        urgency += 20
        reasons.append("Basic needs deprivation")

    # Isolation indicators
    if any(w in msg for w in [
        "no help", "nobody came", "waiting long", "since morning"
    ]):
        urgency += 15
        reasons.append("Delayed assistance")

    # Time-based escalation
    if any(w in msg for w in [
        "since last night", "hours", "long time"
    ]):
        urgency += 10
        reasons.append("Prolonged distress")

    # Cap urgency
    urgency = min(urgency, 100)

    # 🎯 NEED CLASSIFICATION (MORE ACCURATE)
    if any(w in msg for w in ["trapped", "stuck", "inside", "rescue"]):
        need = "Rescue"
    elif any(w in msg for w in ["medical", "injured", "bleeding", "doctor"]):
        need = "Medical"
    elif any(w in msg for w in ["food", "hungry", "no food"]):
        need = "Food"
    elif any(w in msg for w in ["water", "thirsty", "drinking"]):
        need = "Water"
    else:
        need = "General Assistance"

    return {
        "need": need,
        "urgency": urgency,
        "explanation": ", ".join(reasons) if reasons else "General distress detected"
    }