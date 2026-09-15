# 💼 Smart Business ERP

[🚀 **Live Demo**](https://smart-business-7yzrycc99-akhilyaduwanshis-projects.vercel.app)

### 🔑 Demo Credentials

**Username:** `admin`  
**Password:** `password`

A full-stack, secure and role-based **Enterprise Resource Planning (ERP)** system built with **Java, Spring Boot, Spring Security, JWT, JPA/Hibernate, MySQL and React**.

Smart Business ERP helps manage employees, projects, tasks, leaves, attendance, assets and user access through a secure REST API and modern React frontend.

---

## ✨ Features

- 🔐 JWT-based authentication
- 👥 Role-based authorization
- 🧑‍💼 Employee management
- 📁 Project management
- ✅ Task management
- 🗓️ Leave management
- ✔️ Leave approval and rejection workflow
- ⏱️ Attendance management
- 💻 Asset management
- 🔑 User management
- 📊 Dashboard summary
- 🔎 Search and filtering
- 📄 Pagination and sorting
- 🛡️ Ownership-based authorization
- ✅ Bean validation
- ⚠️ Global exception handling
- 📖 Swagger/OpenAPI documentation
- 🌐 Production deployment

---

## 👤 User Roles

### 👑 ADMIN

- Manage employees
- Manage users
- Manage projects
- Manage tasks
- Manage leaves
- Approve/reject leaves
- Manage attendance
- Manage assets
- View dashboard

### 🧑‍💼 MANAGER

- Manage projects
- Manage tasks
- View and manage leaves
- Approve/reject leaves
- Manage attendance
- Manage assets
- View dashboard

### 👨‍💻 EMPLOYEE

- View dashboard
- View assigned tasks
- Create/view own leaves
- View own attendance
- Perform allowed ownership-based operations

---

## 🛠️ Tech Stack

### Backend

- ☕ Java 25
- 🌱 Spring Boot 4.1.0
- 🔐 Spring Security
- 🎟️ JWT
- 🗃️ Spring Data JPA
- 🧩 Hibernate
- 🐬 MySQL 8.x
- 📦 Maven
- ✅ Bean Validation
- 🧰 Lombok
- 📖 Swagger / OpenAPI

### Frontend

- ⚛️ React
- ⚡ Vite
- 🔗 Axios
- 🧭 React Router
- 🎨 CSS

### Deployment

- 🐳 Docker
- ☁️ Render
- 🗄️ Aiven MySQL
- ▲ Vercel

### Tools

- IntelliJ IDEA
- Postman
- Git
- GitHub

---

## 🏗️ Architecture

```text
                    Internet
                       |
                       v
                React Frontend
                    Vercel
                       |
                       | HTTPS REST API
                       v
              Spring Boot Backend
                    Render
                       |
             +---------+---------+
             |                   |
             v                   v
        Spring Security    REST Controllers
             |                   |
             v                   v
      JWT Authentication      Services
                                 |
                                 v
                            Repositories
                                 |
                                 v
                            Aiven MySQL
