# ResQMesh 🆘

**Offline-First Disaster Response Communication System**

A hackathon prototype demonstrating end-to-end communication between disaster
victims and rescue teams — even when internet and cellular infrastructure is down.

---

## Architecture

```
Victim Phone (React App :3000)
         │
         │  POST /relay
         ▼
 Relay Node (Flask :5000)  ← Raspberry Pi / local machine
  ├── SQLite local store
  └── Retry on disconnect
         │
         │  POST /api/report
         ▼
  Backend (Express :3001)
  ├── MongoDB storage
  ├── Socket.IO broadcast
  └── AI triage trigger
         │
         │  POST /triage
         ▼
  AI Service (Flask :5001)
  └── Ollama qwen2.5:1.5b
         │
         ▼
  Dashboard (React :3002)
  ├── Live incident feed
  ├── Leaflet map
  └── Response form
         │
         │  Socket.IO rescue-response event
         ▼
  Victim App shows rescue response ✅
```

---

## Quick Start

```bash
# 1. Install Ollama model
ollama pull qwen2.5:1.5b

# 2. Start MongoDB
mongod

# 3. Backend
cd resqmesh/backend && cp .env.example .env && npm install && npm run dev

# 4. AI Service
cd resqmesh/ai-service && pip install -r requirements.txt && python app.py

# 5. Relay Node
cd resqmesh/relay-node && pip install -r requirements.txt && python app.py

# 6. Frontend (Victim + Dashboard)
cd resqmesh/frontend && cp .env.example .env && npm install && npm run dev
```

Open **http://localhost:3000** for the victim app and **http://localhost:3000/dashboard** for the command center.

---

## Service Ports

| Service | URL |
|---------|-----|
| Backend API | http://localhost:3001 |
| Victim App | http://localhost:3000 |
| Dashboard | http://localhost:3000/dashboard |
| Relay Node | http://localhost:5000 |
| AI Service | http://localhost:5001 |
| Speech Service *(optional)* | http://localhost:5002 |

---

## Features

- **Victim App** — Mobile-optimised SOS form with GPS capture, real-time status tracking
- **Relay Node** — Local SQLite buffer with automatic retry when backend is unreachable
- **Backend** — Express REST API + Socket.IO for real-time broadcast
- **AI Triage** — Ollama `qwen2.5:1.5b` classifies priority (CRITICAL/HIGH/MEDIUM/LOW) with actionable advice
- **Dashboard** — Command center with live incident feed, Leaflet map, and response form
- **Speech-to-Text** *(optional)* — Faster-Whisper for voice input

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS |
| Realtime | Socket.IO |
| Map | Leaflet + react-leaflet |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Relay | Python, Flask, SQLite |
| AI | Python, Flask, Ollama |
| Speech | Python, Flask, Faster-Whisper |

---

## Docs

- [Setup Guide](docs/SETUP.md)
- [Integration Guide & API Reference](docs/INTEGRATION.md)

---

*Built for hackathon demonstration — ResQMesh v1.0*
