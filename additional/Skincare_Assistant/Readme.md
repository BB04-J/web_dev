# Makeup & Skincare Routine Planner

A full-stack MERN application that serves as a personalized skincare assistant. This project allows users to track their daily skincare/makeup routines, manage their skin profile, and receive personalized product recommendations without relying on paid APIs.

## 🚀 Features

* **User Authentication:** Secure JWT-based login and signup flow.
* **Routine Management:** Create, track, edit, and delete morning and night routines.
* **Skin Profiling:** Log your unique skin type and concerns.
* **Zero-Cost Smart Recommendations:** A completely free local recommendation engine that matches your skin type to specific ingredients and routines.
* **Premium UI/UX:** A stunning glassmorphism design with responsive gradients and micro-animations.

## 🛠️ Tech Stack

* **Frontend:** React 18 (Vite), React Router v6, Axios, Vanilla CSS (Glassmorphism design)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Security:** bcrypt (password hashing), JSON Web Tokens (JWT)

## 📦 How to Run Locally

### 1. Start the Backend

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Make sure your local MongoDB server is running (e.g., via MongoDB Compass).
3. Start the server:
   ```bash
   npm run dev
   ```
   *The server will run on http://localhost:5000*

### 2. Start the Frontend

1. Open a *second* terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Click the link provided in the terminal (usually http://localhost:5173) to view your app!

---

*Built by Antigravity as a comprehensive Full-Stack Portfolio Project.*
