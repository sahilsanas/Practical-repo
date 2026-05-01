# Task App (MERN)

A simple task management system where users can **create**, **update**, and **delete** tasks.

## Tech

- Backend: Node.js + Express + TypeScript + MongoDB (Mongoose)
- Frontend: React + Vite + TypeScript

## Database (MongoDB hosting)

Recommended: **MongoDB Atlas**

1. Create a free cluster in Atlas.
2. Create a database user.
3. Add your IP to **Network Access** (or allow from anywhere for quick testing).
4. Copy your connection string and set it as `MONGODB_URI` in the backend `.env`.

Example:

- `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/task_app?retryWrites=true&w=majority`

## Run locally

### 1) Backend

From `task-app/backend`:

- Create `.env` from `.env.example`
- Install + run:

```bash
npm install
npm run dev
```

Backend defaults to: `http://localhost:8083`

Health check:

- `GET http://localhost:8083/api/health`

### 2) Frontend

From `task-app/frontend`:

- Create `.env` from `.env.example` (adjust API URL if needed)
- Install + run:

```bash
npm install
npm run dev
```

Frontend defaults to: `http://localhost:5174`

## API

Base URL: `/api`

- `GET /tasks` — list tasks
- `GET /tasks/:id` — get task
- `POST /tasks` — create task
- `PUT /tasks/:id` — update task
- `DELETE /tasks/:id` — delete task
