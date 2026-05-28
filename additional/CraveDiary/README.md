# 🍰 CraveDiary — A Curated Pastry & Coffee Pairing Journal

CraveDiary is a luxurious, highly aesthetic, and trustworthy web journal dedicated to the art of fine patisserie and dynamic coffee pairings. It blends visual elegance with robust culinary structure, offering a professional tasting-log environment for bakers, home chefs, and pastry connoisseurs worldwide.

---

## 🌟 Premium Visual & Functional Features

1.  **Editorial Pinterest-Style Landing Page**
    *   **Photorealistic Hero Showcase**: Replaces cartoon graphics with a stunning photorealistic Gourmet Chocolate Tiramisu pastry slice, styled inside a 3D glassmorphic Pinterest card frame with smooth hover rotation and translation.
    *   **Serif Editorial Typography**: Employs `'Playfair Display'` headers and a deep cocoa HSL palette.
    *   **Trust and Social Proof Banner**: Minimized brand rows showcasing premium industry accolades (*Le Cordon Bleu, Michelin Guide, Saveur*), creating instant authority.
    *   **High-Trust Stats Board**: Shows live culinary scale counters (*1,200+ Recipes*, *48+ Global Regions*).

2.  **Luxurious Coffee Corner**
    *   **3D Orbital Carousel**: Cylindrical orbital cup slider transitioning in an infinite trigonometric space glide (calculating shortest path rotation to resolve swap jitters).
    *   **Dynamic Theme Backlighting**: Seamlessly fades HSL color accents per active coffee theme (e.g. rich mocha, warm pumpkin spiced caramel, berry grapes, or affogato gold).
    *   **Adaptive Sheer Glass Navbar**: A floating rounded-full navigation pill that dynamically blends and colors itself matching whatever backdrop color transitions behind it.
    *   **Brewing Guides**: Sourced live from the SampleAPIs, featuring ingredient cards and tutorial links.

3.  **Dynamic Discover Catalog**
    *   **Double Random Refresh**: Overhauls standard search results. On every visit or load, the main grid fetches **8 completely random desserts** concurrently, and a **Recommended for You** row fetches 4 random selections, prompting unique pastry discoveries.
    *   **Spoonacular + MealDB Blending**: Dynamically blends high-fidelity Spoonacular metadata with corresponding MealDB search results to deliver rich ingredients list and YouTube video embeds.

4.  **Connoisseur Dashboard & Reviews**
    *   **Tasting Logs**: Bookmark favorites, rate desserts on detailed attributes, track tried pastry checklists, and view community reviews.

---

## 🛠️ Technology Stack

*   **Frontend**: React, Vite, TypeScript, Tailwind CSS v4, Lucide Icons, Embla Carousel.
*   **Backend**: Node.js, Express, MongoDB (Mongoose), Axios.
*   **APIs**: Spoonacular Recipe API, TheMealDB, SampleAPIs Coffee API.

---

## 📂 Repository Structure

```
CraveDiary/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handler controllers (auth, desserts)
│   │   ├── models/           # MongoDB schemas (User, Dessert)
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # Spoonacular & MealDB blending services
│   │   └── utils/
│   ├── .env                  # Confidential local secrets
│   ├── .env.example          # Environment template for GitHub
│   ├── .gitignore            # Backend git filters
│   ├── package.json
│   └── server.js
├── frontend-for-assignment/
│   ├── public/               # Asset folders (/tiramisu.png, /logo.png)
│   ├── src/
│   │   ├── components/       # Component library (Navigation, DessertCard)
│   │   ├── context/          # State providers (AuthContext, DessertContext)
│   │   ├── pages/            # Page layouts (Home, Coffee, Discover)
│   │   └── App.tsx
│   ├── .env                  # Frontend environment variables
│   ├── .env.example          # Environment template for GitHub
│   ├── .gitignore            # Frontend git filters
│   └── vite.config.ts
├── .gitignore                # Root-level Git filters
└── README.md                 # Project handbook
```

---

## 🔑 Environment & API Configuration

To keep the repository secure, credentials are set using environment variables. Local `.env` secrets are ignored by Git.

### 1. Setup Backend Environment

Navigate to the `backend` folder and copy the safe template:
```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and specify the values:
```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/CraveDiary

# Secret string to sign JWT auth tokens
JWT_SECRET=your_jwt_secret_here

# Spoonacular API Credentials (Sourced from Spoonacular Developer Console)
SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# TheMealDB Base URL (Public API)
THEMEALDB_API_URL=https://www.themealdb.com/api/json/v1/1
```

### 2. Setup Frontend Environment

Navigate to the `frontend-for-assignment` folder and copy the safe template:
```bash
cd ../frontend-for-assignment
cp .env.example .env
```

Open `frontend-for-assignment/.env` to verify the public API endpoints:
```env
# Sample APIs Coffee API URLs (Publicly accessible endpoints)
VITE_COFFEE_HOT_API=https://api.sampleapis.com/coffee/hot
VITE_COFFEE_ICED_API=https://api.sampleapis.com/coffee/iced
```

---

## 🚀 How to Launch Locally

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Step 1: Start the Backend Server

```bash
cd backend
npm install
npm run dev
```
The server will start running on **`http://localhost:5000`**.

### Step 2: Start the Frontend Application

Open a new terminal window:
```bash
cd frontend-for-assignment
npm install
npm run dev
```
Vite will start the development server on **`http://localhost:5173`**.

Open your browser and embark on your dessert adventure! 🍰
