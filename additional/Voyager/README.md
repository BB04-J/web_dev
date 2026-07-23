# 🌍 Voyager — Cinematic AI-Powered Travel Platform

Voyager is a modern, full-stack travel platform designed to deliver immersive travel planning, AI-driven itineraries, real-time currency conversion, weather forecasts, and interactive destination discovery.

---

## 🚀 Key Features

* **🪄 AI Trip Planner (Google Gemini AI)**: Generate day-wise itineraries, recommended restaurants, travel tips, and packing lists customized by duration, travel style, and interests.
* **💡 Smart Travel Budget Estimator**: Estimate flights, lodging, food, and transport in USD, automatically converted into your local trip currency (INR, EUR, GBP, JPY, etc.).
* **🎒 Weather-Smart Packing Checklist**: Dynamically generates season and climate-matched packing lists.
* **🌤️ Automatic Weather Forecasts**: Real-time 5-day weather forecasts and activity recommendations with automatic destination geocoding.
* **🧭 Infinite Destination Explorer**: Discover trending destinations with infinite scroll auto-loading, local hotspots, and Mapbox GL coordinates.
* **🔒 Secure Authentication**: JWT-authenticated login, signup, and wishlist management.

---

## 🛠️ Tech Stack

### Frontend (`/voyager-frontend`)
* **Framework**: React 18, Vite
* **Styling**: Vanilla CSS (Modern Design Tokens, Dark Mode, Glassmorphic Glass UI)
* **Animation & Motion**: Framer Motion
* **State Management**: Recoil
* **APIs & Geocoding**: Axios, Open-Meteo API, Frankfurter Currency API

### Backend (`/voyager-backend`)
* **Runtime**: Node.js, Express.js
* **Database**: MongoDB Atlas / Mongoose
* **AI Engine**: Google Gemini API (`gemini-1.5-flash`)
* **Security & Authentication**: JSON Web Tokens (JWT), bcryptjs, CORS

---

## 🔒 Security & Confidentiality Notice

> [!IMPORTANT]
> **Never commit your `.env` files or secret keys to GitHub.**
> All sensitive keys (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`) are kept in local `.env` files that are ignored by `.gitignore`.

When pushing code to GitHub, ensure `.env` remains in `.gitignore`. Use `.env.example` as a template for team members.

---

## 📦 Project Setup Instructions

### 1. Prerequisites
* [Node.js (v18+)](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas Cluster)
* [Google Gemini API Key](https://ai.google.dev/)

### 2. Backend Setup (`voyager-backend`)

```bash
cd voyager-backend/voyager-backend

# Install backend dependencies
npm install

# Create environment config from template
cp .env.example .env
```

Open `.env` and fill in your credentials:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_actual_gemini_api_key
```

Run the backend server:
```bash
npm run dev
```

---

### 3. Frontend Setup (`voyager-frontend`)

```bash
cd voyager-frontend/voyager-frontend

# Install frontend dependencies
npm install

# Create environment config from template
cp .env.example .env
```

Open `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend development server:
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📁 Repository Structure

```
Voyager/
├── .gitignore
├── .env.example
├── README.md
├── voyager-backend/
│   └── voyager-backend/
│       ├── .env
│       ├── .env.example
│       ├── .gitignore
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── server.js
└── voyager-frontend/
    └── voyager-frontend/
        ├── .env
        ├── .env.example
        ├── .gitignore
        ├── src/
        └── vite.config.js
```

---

## 📄 License
MIT License — feel free to use and extend Voyager!
