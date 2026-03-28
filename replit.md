# Flip&Win — Betting Card Matching Game

## Overview
A full-stack PERN (PostgreSQL, Express, React, Node) betting-based card matching game. Users register, manage a virtual wallet, place bets, and play a 10-card number matching game. Includes an admin panel.

## Architecture

### Frontend — React + Vite
- **Location:** `frontend/`
- **Port (dev):** 5000
- **Entry:** `frontend/src/main.jsx`
- **Routing:** React Router DOM v7
- **State:** React Context API (`AuthContext`)
- **HTTP:** Axios with JWT interceptor (`frontend/src/api/axios.js`)
  - Uses `baseURL: ""` (empty) — relative URLs proxied through Vite in dev, same origin in production
- **Vite proxy:** `/api/*` → `http://localhost:3001` in dev

### Backend — Node.js + Express
- **Location:** `backend/`
- **Port (dev):** 3001
- **Entry:** `backend/server.js`
- **Database:** PostgreSQL (Neon) via `pg` package
- **Auth:** JWT (jsonwebtoken) + bcrypt for password hashing

## Key Files
- `backend/config/db.js` — PostgreSQL pool + auto-creates schema on connect
- `backend/models/User.js` — SQL query helpers (findByEmail, findById, create, updateWallet, findAll)
- `backend/middlewares/authMiddleware.js` — JWT verification
- `backend/middlewares/adminMiddleware.js` — Admin guard
- `frontend/src/context/AuthContext.jsx` — Global auth state

## Database Schema (auto-created)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  wallet NUMERIC(12, 2) DEFAULT 1000,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

## API Routes
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/wallet/` — Get wallet balance
- `POST /api/wallet/add` — Add funds
- `POST /api/wallet/deduct` — Deduct funds
- `POST /api/game/start` — Place bet and get card layout
- `POST /api/game/play` — Submit card pick, get result + shuffled cards
- `GET /api/admin/users` — List all users (admin only)
- `POST /api/admin/wallet` — Update user wallet (admin only)

## Environment Variables (Secrets)
- `DATABASE_URL` — Neon PostgreSQL connection string
- `JWT_SECRET` — Secret key for signing JWT tokens
- `PORT` — Backend port (default: 3001)

## Seeded Admin Account
- **Email:** admin@test.com
- **Password:** admin123

## Game Logic
- 10 cards in 2 rows (5 each) with the same set of 5 random numbers, shuffled differently per row
- User picks one card from each row; if numbers match → win 3× bet
- Anti-cheat: cards shuffle positions after every move
- Bet limits: ₹1 – ₹5000; wallet starts at ₹1000

## Workflows
- `Start application` — Frontend dev server (`cd frontend && npm run dev`)
- `Backend API` — Express API server (`cd backend && node server.js`)

## Deployment
- **Target:** Autoscale
- **Build:** `cd frontend && npm install && npm run build`
- **Run:** `NODE_ENV=production node backend/server.js`
- In production, Express serves the built React app and handles all API calls on a single port (5000)
