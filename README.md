# 🚗 Auto Garage Management System

A full-stack Auto Garage Management System built with:

- Frontend: Next.js 15 + React + TypeScript
- Backend: NestJS + TypeORM + PostgreSQL
- Authentication: JWT + HTTP-only Cookies
- State Management: Zustand
- Server State Management: React Query
- Validation: Zod + class-validator
- Styling: Tailwind CSS

This project is designed as a scalable SaaS-style garage management platform where:

- Customers can manage vehicles and service bookings
- Mechanics can manage assigned work
- Admins can manage users, invoices, services, and reports

---

# 🧪 Demo Login Credentials

## Admin Login

```bash
username: admin
password: 123456
```

## Normal User Login

```bash
username: test
password: 123456
```

---

# 📦 Tech Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query
- Zustand
- Zod
- Lucide React Icons

## Backend

- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Passport JWT
- bcrypt
- class-validator
- cookie-parser

---

## Features

### Authentication
- JWT Access Token
- Refresh Token
- Role-based access
- Middleware route protection

### Roles
- Admin
- Mechanic
- Customer

### Modules
- Users
- Vehicles
- Services
- Service Items
- Invoices

### Frontend
- Next.js App Router
- Protected dashboard
- Dynamic sidebar
- React Query mutations
- Zustand global state

### Backend
- NestJS modular architecture
- TypeORM entities
- DTO validation
- Guards & JWT strategy
- REST APIs

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React Query
- Zustand
- Zod

### Backend
- NestJS
- PostgreSQL
- TypeORM
- Passport JWT
- bcrypt

---

## Project Structure

```bash
frontend/
backend/
```

---

## Installation

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
npm install
npm run start:dev
```

---

## Environment Variables

### Frontend

```env
BACKEND_SERVER_URL=http://localhost:3000
JWT_ACCESS_SECRET=garage-access_secret_key
```

### Backend

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/garage
JWT_ACCESS_SECRET=garage-access_secret_key
JWT_REFRESH_SECRET=garage-refresh-secret
```

---

## Authentication Flow

1. User logs in
2. NestJS returns:
   - access_token
   - refresh_token
   - user object
3. Next.js stores tokens in cookies
4. Middleware validates JWT
5. Protected routes become accessible

---

## Invoice System

Invoices are auto-generated from service items.

### Example

```ts
total =
service.items.reduce(
  (sum, item) => sum + Number(item.cost),
  0
);
```

---

## Learning Concepts Used

- JWT Authentication
- Middleware Protection
- Role-based Access Control
- React Query Mutations
- TypeORM Relations
- DTO Validation
- Protected APIs
- Cookie Authentication

---

## Future Improvements

- Payment Gateway
- File Uploads
- Email Notifications
- PDF Invoice Export
- Real-time Notifications
- Docker Deployment

---

## Author

Built while learning full-stack SaaS architecture using Next.js + NestJS.
