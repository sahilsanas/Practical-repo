# Student Platform

A simple full-stack web application for storing and managing student records using MongoDB + an Express backend API, with a Vite/React frontend.

## Features

- Add student records
- Update student records
- Retrieve/list student records
- Delete student records

## Tech

- Backend: Node.js + Express + TypeScript + Mongoose + Zod
- Frontend: Vite + React + TypeScript
- Database: MongoDB

## Setup

### 1) Start MongoDB

Use a local MongoDB server (or MongoDB Atlas). Default URI used by the backend example:

`mongodb://127.0.0.1:27017/student_platform`

### 2) Backend

From `student-platform/backend`:

1. Create env file:
   - Copy `.env.example` to `.env`
2. Install deps:
   - `npm install`
3. Run dev server:
   - `npm run dev`

Backend runs on `http://localhost:8081` by default.

### 3) Frontend

From `student-platform/frontend`:

1. (Optional) Create env file:
   - Copy `.env.example` to `.env`
2. Install deps:
   - `npm install`
3. Run dev server:
   - `npm run dev`

Frontend runs on `http://localhost:5173` by default.

## API

Base URL: `http://localhost:8081/api`

- `GET /students` → list students
- `GET /students/:id` → get a student
- `POST /students` → create a student
- `PUT /students/:id` → update a student
- `DELETE /students/:id` → delete a student

### Student shape

```
{
  "id": "...",
  "firstName": "...",
  "lastName": "...",
  "rollNumber": "...",
  "email": "...",
  "program": "...",
  "year": 1,
  "status": "active",
  "createdAt": "...",
  "updatedAt": "..."
}
```
