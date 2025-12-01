# Mini Project Management API (Node.js + PostgreSQL)

A clean, modular backend service for managing **Users**, **Projects**, **Tasks**, and **Comments** — built using **Express (ESM)**, **PostgreSQL**, **Joi Validation**, **JWT Auth**, **Redis Caching**, and **Background Workers**.

This project fulfills the full assignment requirement and includes optional bonus features.

---

## Features

### **Core Features**

- User Registration & Login (JWT Auth)
- Create & Manage Projects
- Create, Update & List Tasks
- Add Comments on Tasks
- Assign Users to Tasks
- Task Filtering & Pagination
- SQL Joins for complex responses
- Input validation using Joi

### **Bonus Features**

- Authentication (JWT) (login + token validation)
- Redis Caching (Task list cached for 30 seconds)
- Background Worker (Cron-based due-date reminders)
- Optional Python Script for task summary

---

## Project Structure

```
src/
 ├── app.js
 ├── server.js
 ├── config/
 │    ├── db.js
 │    └── cookieOptions.js
 ├── middlewares/
 │    ├── auth.middleware.js
 │    ├── error.middleware.js
 │    └── validate.middleware.js
 ├── utils/
 │    ├── apiError.js
 │    ├── apiError.js
 │    └── asyncHandler.js
 ├── routes/
 │    ├── auth.routes.js
 │    ├── user.routes.js
 │    ├── project.routes.js
 │    └── task.routes.js
 ├── controllers/
 ├── services/
 ├── validators/
 └── workers/
      └── taskReminder.worker.js
 ├── python-task/
 │    ├── tasks.json
 │    ├── summarize_tasks.py
 │    └── summary.json
```

---

## Database Setup (PostgreSQL + Migration)

### **1. Create `.env` file**

```
DATABASE_URL=postgresql://user:password@host:port/db
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
REDIS_URL=your_upstash_redis_url
NODE_ENV=development
USER_COOKIE_EXPIRY=604800000
```

### **2. Run migrations**

```
npm run migrate
```

This executes `migrations.sql`, creating:

- users
- projects
- tasks
- comments
- due_date field
- ENUM `task_status`

---

## Running the API

### **Development server**

```
npm run dev
```

---

## Auth APIs

### **Register**

```
POST /api/v1/auth
```

Body:

```json
{
  "name": "Hritik Chauhan",
  "email": "hritik@example.com",
  "password": "Password123!"
}
```

### **Login**

```
POST /api/v1/auth/login
```

### **Logout**

```
POST /api/v1/auth/logout
```

---

## Projects APIs

### **Create Project**

```
POST /api/v1/projects
```

Body:

```json
{ "name": "Project Apollo", "description": "Internal build" }
```

### **List Projects**

```
GET /api/v1/projects
```

---

## Tasks APIs

### **Create Task**

```
POST /api/v1/tasks
```

Body:

```json
{
  "project_id": "uuid",
  "title": "Setup CI/CD",
  "description": "Pipeline",
  "assigned_to": "uuid"
}
```

### **Update Task**

```
PATCH /api/v1/tasks/:id
```

### **List Tasks**

```
GET /api/v1/tasks?project_id=&status=&assigned_to=&page=1&limit=10
```

Includes:

- Project info
- Assigned user info
- Latest comment

### **Add Comment**

```
POST /api/v1/tasks/:id/comments
```

Body:

```json
{
  "user_id": "uuid",
  "message": "CI/CD pipeline deployed successfully."
}
```

---

## Redis Caching (Bonus)

Task list results are cached for **30 seconds** using:

```js
redis.set(cacheKey, JSON.stringify(data), "EX", 30);
```

Cache clears when:

- Task created
- Task updated
- Comment added

---

## Background Worker (Bonus)

Cron-based reminder worker:

```
Runs every 10 seconds (dev mode)
Checks tasks due tomorrow
Logs reminders
```

File: `src/workers/taskReminder.worker.js`

Run worker:

```
npm run worker
```

---

## Python Bonus Task

File: `python-task/summarize_tasks.py`

### **Usage**

```
python summarize_tasks.py
```

Input: `tasks.json`  
Output: `summary.json`

Summarizes:

- Total tasks
- Count by status
- Count by assigned user

---

## Postman Collection (Optional)

Includes:

- Auth
- Projects
- Tasks
- Comments
- Filters
- Update APIs

Folder: `postman`

---

## How to Run Everything

### Install dependencies

```
npm install
```

### Setup PostgreSQL database

Run migrations:

```
npm run migrate
```

### Start API

```
npm run dev
```

### Start Background Worker

```
npm run worker
```

### (Optional) Run Python Analysis

```
python summarize_tasks.py
```

---

## Final Notes

This backend is:

- Clean
- Modular
- Production-ready
- Fully aligned with assignment requirements

You may deploy on:

- Render
- Railway
- Vercel + Neon + Upstash

---

## Screenshots

### User Registration API

![Register API](assets/screenshots/register.png)
![Register Validation ](assets/screenshots/register_validation.png)

### User Login API

![Login API](assets/screenshots/login.png)
![Login Validation](assets/screenshots/login_validation.png)

### User Logout API

![Logout API](assets/screenshots/logout.png)

### Get User API

![Get User API](assets/screenshots/get_user.png)

### Check Authentication

![Check Authentication](assets/screenshots/check_authentication.png)

### Project API

![Create Project API](assets/screenshots/create_project.png)
![Project Validation](assets/screenshots/project_validation.png)
![List Projects API](assets/screenshots/get_projects.png)

### Task APIs

![Create Task API](assets/screenshots/create_task.png)
![Task Validation](assets/screenshots/task_validation.png)
![Task Validation 2](assets/screenshots/task_validation2.png)
![List Tasks API](assets/screenshots/list_task_with_filter.png)
![Update Task API](assets/screenshots/update_task.png)
![Update Task Validation](assets/screenshots/update_task_validation.png)
![Add Comment API](assets/screenshots/add_comment.png)

### Redis Caching

![Redis Caching](assets/screenshots/redis1.png)
![Redis Caching2](assets/screenshots/redis2.png)

### Background Worker

![Background Worker](assets/screenshots/background_worker.png)

---

## License

MIT
