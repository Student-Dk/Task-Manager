# Task Management System

Task Management System is a full-stack web application that allows users to register, log in, and manage their daily tasks. The frontend is built with React and Vite, while the backend provides a REST API using Node.js, Express.js, MongoDB, and Mongoose.

## What This Project Does

- Provides user registration and login.
- Uses JWT based authentication for protected pages and API routes.
- Hashes passwords with bcrypt before storing them in the database.
- Allows users to create, view, update, and manage tasks.
- Supports task statuses: `todo`, `in-progress`, and `done`.
- Includes role based access control:
  - Regular users can view and update only their own tasks.
  - Admin users can view all tasks.
  - Only admin users can delete tasks.
- Validates backend request data with `express-validator`.
- Uses centralized backend error handling.
- Protects frontend dashboard routes from unauthenticated users.
- Sends JWT tokens automatically with API requests using an Axios interceptor.
- Provides a dashboard UI for adding, editing, updating status, and deleting tasks.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- express-validator
- cors
- dotenv
- nodemon

## Folder Structure

```text
Task Management System/
  Frontend/
    src/
      api/
      components/
      pages/
      App.jsx
      main.jsx
      styles.css
    package.json
    vite.config.js

  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
      v1/
    utils/
    server.js
    package.json
```

## Backend API

Base URL:

```text
http://localhost:5000/api/v1
```

### Authentication Routes

```http
POST /auth/register
POST /auth/login
```

### Task Routes

```http
GET    /tasks
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

Task routes are protected, so requests must include a JWT token in the authorization header:

```http
Authorization: Bearer your_jwt_token
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Task Management System"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd Frontend
npm install
```

If you want to customize the API base URL, create a `.env` file inside the `Frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Start the frontend development server:

```bash
npm run dev
```

## Available Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Main Workflow

1. A user registers or logs in.
2. The backend returns a JWT token.
3. The frontend stores the token in localStorage.
4. The user can create, view, and update tasks from the dashboard.
5. Admin users can also delete tasks.
6. Logging out removes the token from localStorage.

## Environment Variables

### Backend

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |
| `PORT` | Backend server port |

### Frontend

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the backend API |

## Notes

- MongoDB must be running locally, or you can use a MongoDB Atlas connection string.
- To create an admin user, send `role: "admin"` while registering through the API.
- Use a strong `JWT_SECRET` in production.
