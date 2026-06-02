# Task Management System Backend

Node.js, Express.js, and MongoDB API scaffold for the Task Management System.

## Folder Structure

```text
config/
  db.js
  env.js
models/
controllers/
routes/
  v1/
middleware/
utils/
server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/task_management_system
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

4. Start the development server:

```bash
npm run dev
```

## Health Check

```http
GET /api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is healthy"
}
```

## Authentication

Register a user:

```http
POST /api/v1/auth/register
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

Login:

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Both endpoints return a JWT. Send it to protected routes with:

```http
Authorization: Bearer your_jwt_token
```

## Tasks

All task routes require a JWT in the `Authorization` header.

List tasks:

```http
GET /api/v1/tasks
Authorization: Bearer your_jwt_token
```

Regular users receive only their own tasks. Admin users receive all tasks.

Create a task:

```http
POST /api/v1/tasks
Authorization: Bearer your_jwt_token
Content-Type: application/json
```

```json
{
  "title": "Plan sprint",
  "description": "Create tasks for the next sprint",
  "status": "todo"
}
```

Update a task:

```http
PUT /api/v1/tasks/:id
Authorization: Bearer your_jwt_token
Content-Type: application/json
```

Only the task owner or an admin can update a task.

Delete a task:

```http
DELETE /api/v1/tasks/:id
Authorization: Bearer admin_jwt_token
```

Only admins can delete tasks.
