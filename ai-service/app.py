"""
ResQMesh AI Triage Service
--------------------------
Classifies emergency messages using Ollama (qwen2.5:1.5b) and returns
a priority level (CRITICAL / HIGH / MEDIUM / LOW) with actionable advice.
Falls back gracefully if Ollama is unavailable.
"""

import json
import logging
import re

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5:1.5b"

PROMPT_TEMPLATE = """\
You are an emergency triage assistant. Analyse the emergency message below and \
classify its severity. Respond with ONLY a valid JSON object — no markdown, \
no explanation.

Emergency: __MESSAGE__

Required JSON format:
{
  "priority": "CRITICAL",
  "advice": "Brief, actionable advice for the rescue team"
}

Priority rules:
- CRITICAL : immediate life threat (cardiac arrest, severe bleeding, trapped, fire)
- HIGH     : serious injury or significant danger
- MEDIUM   : moderate emergency, stable but needs attention
- LOW      : minor issue, non-urgent

Return only the JSON object:\
"""


# ---------------------------------------------------------------------------
# Response parsing
# ---------------------------------------------------------------------------

def parse_response(text: str) -> dict:
    """Extract priority + advice from Ollama's raw text output."""
    text = text.strip()
    
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    
    text = text.strip()

    # 1. Direct JSON parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 2. Extract JSON block with regex
    for pattern in [
        r'\{[^{}]*"priority"[^{}]*"advice"[^{}]*\}',
        r'\{[^{}]*"advice"[^{}]*"priority"[^{}]*\}',
    ]:
        m = re.search(pattern, text, re.DOTALL)
        if m:
            try:
                return json.loads(m.group())
            except json.JSONDecodeError:
                pass

    # 3. Keyword fallback
    priority = "HIGH"
    for p in ("CRITICAL", "HIGH", "MEDIUM", "LOW"):
        if p in text.upper():
            priority = p
            break

    return {"priority": priority, "advice": "Manual triage recommended."}


def validate(result: dict) -> dict:
    """Ensure the result contains valid fields."""
    valid_priorities = {"CRITICAL", "HIGH", "MEDIUM", "LOW"}
    if result.get("priority") not in valid_priorities:
        result["priority"] = "HIGH"
    if not result.get("advice"):
        result["advice"] = "Immediate manual assessment required."
    return result


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/triage", methods=["POST"])
def triage():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "message is required"}), 400

    logger.info(f"Triaging: \"{message[:80]}{'…' if len(message) > 80 else ''}\"")

    try:
        resp = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": PROMPT_TEMPLATE.replace("__MESSAGE__", message),
                "stream": False,
                "format": "json",
                "options": {"temperature": 0.1, "num_predict": 150},
            },
            timeout=60,
        )
        resp.raise_for_status()

        raw_text = resp.json().get("response", "")
        logger.info(f"Raw Ollama response: {raw_text[:200]}")

        result = validate(parse_response(raw_text))
        logger.info(f"Triage result: {result}")
        return jsonify(result)

    except requests.exceptions.ConnectionError:
        logger.error("Ollama not reachable — returning HIGH default")
        return jsonify({
            "priority": "HIGH",
            "advice": "AI service unavailable — prioritised for manual review.",
        })

    except requests.exceptions.Timeout:
        logger.error("Ollama timed out")
        return jsonify({
            "priority": "HIGH",
            "advice": "Triage timed out — manual assessment required.",
        })

    except Exception as exc:
        logger.error(f"Unexpected error: {exc}")
        return jsonify({
            "priority": "HIGH",
            "advice": "Triage error — immediate manual assessment required.",
        })


@app.route("/health", methods=["GET"])
def health():
    ollama_status = "unreachable"
    try:
        r = requests.get("http://localhost:11434/api/tags", timeout=5)
        ollama_status = "connected" if r.ok else "error"
    except requests.exceptions.RequestException:
        pass

    return jsonify({"status": "ok", "ollama": ollama_status, "model": MODEL})


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    logger.info(f"ResQMesh AI Triage Service starting on port 5001")
    logger.info(f"Using model: {MODEL}")
    app.run(host="0.0.0.0", port=5001, debug=False)
