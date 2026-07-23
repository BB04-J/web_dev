# Voyager — Backend

REST API for **Voyager**, a travel planning application. Built with
Node.js, Express, MongoDB (Mongoose), JWT authentication, and Zod
validation.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) for authentication
- Zod for request validation
- bcryptjs for password hashing

## Project Structure

```
voyager-backend/
├── config/
│   └── db.js                # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── tripController.js
│   └── wishlistController.js
├── middleware/
│   ├── auth.js               # JWT "protect" middleware
│   ├── errorHandler.js       # centralized error handling
│   └── validate.js           # Zod validation middleware
├── models/
│   ├── User.js
│   ├── Trip.js                # itinerary, budget, packing embedded
│   └── Wishlist.js
├── routes/
│   ├── authRoutes.js
│   ├── tripRoutes.js
│   └── wishlistRoutes.js
├── utils/
│   ├── ApiError.js
│   ├── asyncHandler.js
│   └── seed.js               # optional demo data seeder
├── validators/
│   ├── authValidators.js
│   ├── tripValidators.js
│   └── wishlistValidators.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable        | Description                                   |
| --------------- | ---------------------------------------------- |
| `PORT`          | Port the API runs on (default `5000`)          |
| `NODE_ENV`      | `development` or `production`                  |
| `MONGO_URI`     | MongoDB connection string                       |
| `JWT_SECRET`    | Long random string used to sign JWTs            |
| `JWT_EXPIRES_IN`| Token lifetime, e.g. `7d`                       |
| `CLIENT_URL`    | Frontend origin, for CORS (e.g. Vite dev server)|

You'll need a MongoDB instance — either local (`mongodb://127.0.0.1:27017/voyager`)
or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### 3. Run the server

```bash
npm run dev     # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

The API will be available at `http://localhost:5000`.

### 4. (Optional) Seed demo data

```bash
npm run seed
```

Creates a demo user (`demo@voyager.app` / `password123`) with a sample trip.

## API Reference

All authenticated routes require an `Authorization: Bearer <token>` header.

### Auth

| Method | Route              | Auth | Description          |
| ------ | ------------------ | ---- | --------------------- |
| POST   | `/api/auth/register`| No  | Create an account      |
| POST   | `/api/auth/login`   | No  | Log in, receive a JWT  |
| GET    | `/api/auth/me`      | Yes | Get the current user   |

### Trips

| Method | Route                              | Description                        |
| ------ | ----------------------------------- | ----------------------------------- |
| GET    | `/api/trips`                        | List the current user's trips       |
| GET    | `/api/trips/stats/summary`          | Travel stats (bonus challenge 3)    |
| GET    | `/api/trips/:id`                    | Get a single trip                    |
| POST   | `/api/trips`                        | Create a trip                        |
| PUT    | `/api/trips/:id`                    | Update a trip                        |
| DELETE | `/api/trips/:id`                    | Delete a trip                        |
| POST   | `/api/trips/:id/itinerary`          | Add an itinerary item                |
| PUT    | `/api/trips/:id/itinerary/:itemId`  | Update an itinerary item             |
| DELETE | `/api/trips/:id/itinerary/:itemId`  | Remove an itinerary item             |
| POST   | `/api/trips/:id/budget`             | Add a budget line item               |
| DELETE | `/api/trips/:id/budget/:itemId`     | Remove a budget line item            |
| POST   | `/api/trips/:id/packing`            | Add a packing list item              |
| PUT    | `/api/trips/:id/packing/:itemId`    | Toggle / update a packing item       |
| DELETE | `/api/trips/:id/packing/:itemId`    | Remove a packing item                |

### Wishlist

| Method | Route                | Description               |
| ------ | --------------------- | -------------------------- |
| GET    | `/api/wishlist`       | List wishlisted destinations|
| POST   | `/api/wishlist`       | Add a destination           |
| DELETE | `/api/wishlist/:id`   | Remove a destination        |

## Notes

- Weather and currency-conversion data are fetched **directly from the
  frontend** using free, CORS-enabled public APIs (Open-Meteo and
  Frankfurter) — no API key or backend proxy required. See the frontend
  README for details.
- Passwords are hashed with bcrypt; plaintext passwords are never stored
  or returned.
- All trip and wishlist data is scoped to `req.user`, so users can only
  ever read or modify their own records.
