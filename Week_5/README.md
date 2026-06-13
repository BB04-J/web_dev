# Taskify — Task Management Application

A full-stack task manager containing a clean client dashboard interface (HTML/CSS/JS) and a robust REST API backend (Express, MongoDB, Mongoose, JWT authentication).

## Folder Structure

```text
Week_5/
├── backend/
│   ├── db/
│   │   └── index.js          # Database connection & Mongoose Schemas (User, Todo)
│   ├── middleware/
│   │   └── user.js           # JWT verification middleware
│   ├── routes/
│   │   ├── index.js          # Main server router & Express entrypoint
│   │   ├── user.js           # User registration and authentication routes
│   │   └── todo.js           # Task management routes (CRUD)
│   ├── .env                  # Environment configurations (MONGO_URL, PORT, JWT_SECRET)
│   └── package.json          # Node dependencies & run scripts
└── frontend/
    ├── index.html            # Dashboard main interface
    ├── script.js             # Interaction logic & calculations
    └── style.css             # Vanilla CSS dashboard styling
```

---

## Getting Started

### 1. Database Setup & Configurations

A configuration file `.env` is created under the `backend` folder. By default, it connects to a local MongoDB instance. If you have MongoDB Atlas, update the URL in `backend/.env`:

```env
PORT=3000
MONGO_URL="YOUR_MONGODB_URI"
JWT_SECRET="taskify_secret"
```

### 2. Run the Backend Server

Navigate to the `backend` directory, install packages, and start the server:

```bash
cd backend
npm install
npm start
```

For development mode (auto-reloading via nodemon):
```bash
npm run dev
```

The server runs on port `3000` (or the port specified in `.env`).

### 3. Run the Frontend Dashboard

Since the frontend is built using static HTML, CSS, and JavaScript:
- You can open the `frontend/index.html` file directly in any modern browser.
- Alternatively, serve it locally using a utility like VS Code's Live Server extension, or install `serve` / `http-server` via npm:
  ```bash
  npx serve frontend
  ```

---

## API Documentation

All backend API requests should send `Content-Type: application/json` headers. Authenticated endpoints require the JWT token to be passed in the headers.

### User Endpoints

#### Signup
- **Endpoint**: `POST /user/signup`
- **Body Payload**:
  ```json
  {
    "username": "alex",
    "email": "alex@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "message": "User created successfully"
  }
  ```

#### Login
- **Endpoint**: `POST /user/login`
- **Body Payload**:
  ```json
  {
    "email": "alex@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### Todo Endpoints

All Todo endpoints require the authentication header `token` containing your JWT.

#### Create Todo
- **Endpoint**: `POST /todo`
- **Headers**: `token: <JWT_TOKEN>`
- **Body Payload**:
  ```json
  {
    "title": "Review Q3 Marketing Strategy",
    "completed": false
  }
  ```
- **Response**: `201 Created`

#### Get Todos
- **Endpoint**: `GET /todo`
- **Headers**: `token: <JWT_TOKEN>`
- **Response**: `200 OK`
  ```json
  [
    {
      "_id": "60d0fe4f5311236168a109ca",
      "title": "Review Q3 Marketing Strategy",
      "completed": false,
      "userId": "60d0fe1f5311236168a109c9",
      "__v": 0
    }
  ]
  ```

#### Update Todo
- **Endpoint**: `PUT /todo`
- **Headers**: `token: <JWT_TOKEN>`
- **Body Payload**:
  ```json
  {
    "id": "60d0fe4f5311236168a109ca",
    "title": "Review Q3 Marketing Strategy (Updated)",
    "completed": true
  }
  ```
- **Response**: `200 OK`

#### Delete Todo
- **Endpoint**: `DELETE /todo/:id`
- **Headers**: `token: <JWT_TOKEN>`
- **Response**: `204 No Content`
