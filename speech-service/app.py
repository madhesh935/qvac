"""
ResQMesh Speech-to-Text Service (Optional)
------------------------------------------
Transcribes audio files to text using Faster-Whisper (tiny model).
Useful for victims who cannot type — they can record a voice message
which gets transcribed and fed into the emergency form.

Usage:
  POST /transcribe
  Content-Type: multipart/form-data
  Body: audio=<file>

Returns:
  { "text": "...", "language": "en", "language_probability": 0.99 }
"""

import logging
import os
import tempfile

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

# Lazy-load the model to avoid slow startup if unused
_whisper_model = None


def get_model():
    global _whisper_model
    if _whisper_model is None:
        from faster_whisper import WhisperModel  # noqa: PLC0415

        logger.info("Loading Whisper tiny model (first call may take a moment)…")
        _whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8")
        logger.info("Whisper model ready")
    return _whisper_model


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file — send as multipart field 'audio'"}), 400

    audio_file = request.files["audio"]
    suffix = os.path.splitext(audio_file.filename or "audio.wav")[1] or ".wav"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name

    try:
        model = get_model()
        segments, info = model.transcribe(tmp_path, beam_size=5)
        text = " ".join(seg.text for seg in segments).strip()

        logger.info(f"Transcribed ({info.language}): {text[:100]}")
        return jsonify({
            "text": text,
            "language": info.language,
            "language_probability": round(info.language_probability, 3),
        })

    except Exception as exc:
        logger.error(f"Transcription error: {exc}")
        return jsonify({"error": str(exc)}), 500

    finally:
        os.unlink(tmp_path)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "speech-to-text",
        "model": "faster-whisper/tiny",
    })


if __name__ == "__main__":
    logger.info("ResQMesh Speech Service starting on port 5002")
    app.run(host="0.0.0.0", port=5002, debug=False)
