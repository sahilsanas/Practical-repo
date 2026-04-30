# E-Commerce

A minimal e-commerce web application using MongoDB + an Express backend API, with a Vite/React frontend.

## Features

- Browse products
- Add products to cart
- Checkout (simulated purchase)
- Checkout decrements product stock and creates an order

## Tech

- Backend: Node.js + Express + TypeScript + Mongoose + Zod
- Frontend: Vite + React + TypeScript
- Database: MongoDB

## Setup

### 1) Start MongoDB

Use a local MongoDB server or MongoDB Atlas.

Default backend URI example:

`mongodb://127.0.0.1:27017/ecommerce`

### 2) Backend

From `ecommerce/backend`:

- Copy `.env.example` → `.env`
- `npm install`
- Seed sample products: `npm run seed`
- Run: `npm run dev`

Backend runs on `http://localhost:8082` by default.

### 3) Frontend

From `ecommerce/frontend`:

- Copy `.env.example` → `.env` (optional)
- `npm install`
- Run: `npm run dev`

Frontend runs on `http://localhost:5176` by default.

## API

Base URL: `http://localhost:8082/api`

- `GET /products` → list products
- `GET /products/:id` → get product
- `POST /products` → create product (optional, for setup)
- `PUT /products/:id` → update product (optional, for setup)

- `GET /orders` → list orders
- `GET /orders/:id` → get order
- `POST /orders` → checkout / create order

### Checkout payload

```
{
  "customer": { "name": "Optional", "email": "optional@example.com" },
  "items": [{ "productId": "<mongoId>", "quantity": 2 }]
}
```
