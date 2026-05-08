# 🚀 SaaS User Management & Task System (Next.js + Prisma + PostgreSQL)

A full-stack **role-based SaaS-style application** built with **Next.js (App Router), Prisma, PostgreSQL, JWT authentication, Zustand, and React Query**, featuring secure authentication, role-based dashboards, and scalable task management architecture.

This project simulates a real-world SaaS system with Admin-controlled task assignment and user task lifecycle management.

---

## 🌐 Live Demo

👉 https://nextjs-vercel-demo-project.vercel.app/

---

## 🔐 Demo Credentials

### 🛠️ Admin Login
- Username: admin
- Password: 123456

### 👤 User Login
- Username: anik
- Password: 12345

Both roles can log in via:
👉 /login

After login:
- Admin → Backend Dashboard
- User → Frontend Profile Dashboard

---

## 📌 Core Features

### 👤 User Features
- Secure authentication (JWT-based)
- Profile dashboard
- View assigned tasks (Todos)
- Update task status (Pending → Completed)
- View profile details (hobbies, job type, etc.)

---

### 🛠️ Admin Features
- Full user management (CRUD)
- Assign tasks (Todos) to users
- Monitor task completion status
- Centralized backend dashboard
- Role-based access control (RBAC)

---

## 🧠 SaaS Workflow

Admin → Creates Task → Assigns to User → User Updates Status → Admin Monitors Progress

---

## 🔐 Authentication & Security

- JWT authentication (httpOnly cookies)
- Role-based access control (Admin / User)
- Protected routes (middleware-based)
- Password hashing using bcrypt
- Auto logout on invalid/expired token

---

## 🧰 Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- Zustand (Global State Management)
- React Query (Server State Management)

### Backend
- Next.js API Routes
- Prisma ORM

### Database
- PostgreSQL

### Auth & Security
- JWT (jose)
- bcrypt
- Middleware-based route protection

### Validation
- Zod
- React Hook Form

---

## 🗄️ Database Models

- User
- Todo (Task Management)
- Comment System *(in development)*
- File Attachments *(in development)*

---

## 🚧 In Progress Features

- 💬 Comment system on tasks (multi-comment support)
- 📎 File attachment system (proof-based task updates)
- 📊 Advanced analytics dashboard
- 🔔 Notifications system

---

## ⚙️ Setup Instructions

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 🧱 Architecture Overview

Frontend (Next.js)
→ Zustand (UI State)
→ React Query (Server State)
→ API Routes
→ Prisma
→ PostgreSQL Database

---

## 📌 Notes

- Zustand handles UI/global state
- React Query handles server caching and API data
- Prisma handles all database operations
- JWT stored in httpOnly cookies for security

---

## 🚀 Future Improvements

- Real-time chat system
- WebSocket notifications
- Advanced admin analytics dashboard
- File upload with S3 integration
