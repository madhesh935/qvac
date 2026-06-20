# ResQMesh Frontend

Unified React app containing both the **Victim App** and **Command Center Dashboard**.

## Routes

| Route | App |
|-------|-----|
| `/` | Victim emergency portal |
| `/dashboard` | Rescue command center |

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

## Structure

```
frontend/
├── src/
│   ├── App.jsx              # React Router
│   ├── main.jsx
│   └── apps/
│       ├── victim/          # Victim SOS app
│       └── dashboard/       # Command center
└── package.json
```

## Environment

```
VITE_RELAY_URL=http://localhost:5000
VITE_BACKEND_URL=http://localhost:3001
```
