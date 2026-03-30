# Flip&Win 🎰

A full-stack betting-based card matching game with real wallet management, JWT authentication, and admin controls. Users can place bets, play strategic card games, and win rewards in a secure environment.

---

## 📌 Features

### User Authentication

* JWT-based login and registration
* Secure password hashing
* Session management

### Wallet System

* Add money to wallet
* Withdraw money from wallet
* Real-time balance tracking
* Transaction history

### Betting System

* Place bets before game starts
* Automatic wallet deduction on bet placement
* Wallet credit on game win

### Card Matching Game

* **Board Layout:** 2 rows of 5 cards (10 cards total)
* **Card Set:** Same numbers in both rows but randomly shuffled

**Game Mechanics:**

* Cards flip on selection with smooth animations
* Matched pairs remain open
* Non-matched pairs flip back automatically
* Limited attempts per game (default: 10 attempts)
* Win condition: Successfully match 3 pairs
* Lose condition: Exceed maximum attempts

### Anti-Cheat Logic

* **Dynamic Shuffling:** Cards reshuffle periodically during the game
* **Interaction-Based:** Shuffle stops immediately when user interacts
* **Security:** Prevents memorization exploits

### Admin Panel

* View all registered users with statistics
* Adjust user wallet balances
* Monitor total users
* Track total wallet value

---

## 🧠 Game Logic Explanation

### Card Generation

1. Two identical arrays (numbers 1–5 repeated) are created
2. Both arrays are shuffled independently
3. Cards are placed in a 2×5 grid

### Matching System

* Select two cards
* Match → stays open
* No match → flips back + attempt used

### Attempt System

* Limited attempts (default: 10)
* Failed match = -1 attempt
* Match = no penalty
* 0 attempts = loss

### Shuffle Logic

* Auto reshuffle every 8–10 seconds
* Reshuffle on failed match
* Prevents memorization

### Win/Loss Conditions

* **Win:** Match ≥ 3 pairs
* **Loss:** Attempts exhausted

### Wallet Update

* Bet deducted before game
* Win → bet × multiplier
* Loss → bet lost
* All transactions logged

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Axios
* React Router
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT
* bcryptjs

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📁 Folder Structure

```
BettingApp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── context/
│   │   ├── api/
│   │   ├── assets/
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   ├── config/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js ≥ v14
* npm or yarn
* MongoDB

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=5000
```

Run:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```
VITE_API_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

---

## 🔐 Environment Variables

### Backend

| Variable   | Description        |
| ---------- | ------------------ |
| MONGO_URI  | MongoDB connection |
| JWT_SECRET | Auth secret        |
| NODE_ENV   | Env mode           |
| PORT       | Server port        |

### Frontend

| Variable     | Description     |
| ------------ | --------------- |
| VITE_API_URL | Backend API URL |

---

## 👨‍💼 Admin Access

**Email:** [admin@test.com](mailto:admin@test.com)
**Password:** admin123

---

## 📌 Important Notes

* Never commit `.env` files
* Start backend before frontend
* Use strong JWT secrets
* Use HTTPS in production

---

## 📈 Future Improvements

* Transaction history UI
* Better animations
* Payment gateway integration
* Leaderboards
* Multiplayer mode
* Mobile optimization
* Email notifications
* 2FA authentication
* Custom themes

---

## 📄 License

For educational and demonstration purposes.

---

## 🤝 Support

Open issues or contact the developer.

---

**Version:** 1.0.0
**Last Updated:** March 2026