# Event App (MongoDB + React + Express)

A small web application where users can **register for an event** by submitting their details. The details are stored in a **MongoDB** database.

## Tech

- Backend: Node.js + Express + TypeScript + MongoDB (Mongoose)
- Frontend: React + Vite + TypeScript

## Database hosting (MongoDB Atlas)

1. Create a free cluster in MongoDB Atlas.
2. Create a database user.
3. In **Network Access**, add your IP (or allow from anywhere for quick testing).
4. Copy your connection string and set it as `MONGODB_URI` in the backend `.env`.

Example:

- `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/event_app?retryWrites=true&w=majority`

## Run locally

### 1) Backend

From `event-app/backend`:

- Create `.env` from `.env.example` and set `MONGODB_URI`.
- Install + run:

```bash
npm install
npm run dev
```

Backend defaults to: `http://localhost:8084`

Health check:

- `GET http://localhost:8084/api/health`

### 2) Frontend

From `event-app/frontend`:

- Create `.env` from `.env.example` (defaults to `http://localhost:8084/api`).
- Install + run:

```bash
npm install
npm run dev
```

Frontend defaults to: `http://localhost:5175`

## API

- `POST /api/registrations` — create a registration (stored in MongoDB)

Body example:

```json
{
  "fullName": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "+91 98765 43210",
  "organization": "ABC College"
}
```
