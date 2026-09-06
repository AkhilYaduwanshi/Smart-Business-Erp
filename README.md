# Smart Business ERP

A secure and modular Enterprise Resource Planning (ERP) backend built using
Spring Boot, Spring Security, JWT, JPA/Hibernate, MySQL and Swagger/OpenAPI.

## Overview

Smart Business ERP is a backend system designed to manage common business
operations such as employees, projects, tasks, leaves, attendance and company
assets.

The application includes JWT-based authentication, role-based authorization,
employee ownership checks, validation, exception handling, pagination,
filtering, sorting and API documentation.

## Features

- Employee Management
- Project Management
- Task Management
- Leave Management
- Leave Approval Workflow
- Attendance Management
- Asset Management
- Dashboard Summary
- JWT Authentication
- Role-Based Authorization
- Employee Ownership Authorization
- Pagination
- Search and Filtering
- Sorting
- Global Exception Handling
- Swagger/OpenAPI Documentation

## User Roles

### ADMIN

- Manage employees
- Manage users
- Manage projects
- Manage tasks
- Manage leaves
- Approve/reject leaves
- Manage attendance
- Manage assets
- View dashboard summary

### MANAGER

- Manage projects
- Manage tasks
- View and manage leaves
- Approve/reject leaves
- Manage attendance
- Manage assets
- View dashboard summary

### EMPLOYEE

- View own employee profile
- View own leaves
- Create own leave requests
- View own attendance
- Create own attendance
- View assigned tasks
- Update/delete only owned records where permitted

## Technology Stack

| Technology | Purpose |
|---|---|
| Java | Backend programming language |
| Spring Boot | REST API framework |
| Spring Security | Authentication and authorization |
| JWT | Stateless authentication |
| Spring Data JPA | Database access |
| Hibernate | ORM |
| MySQL | Relational database |
| Maven | Build and dependency management |
| Bean Validation | Request validation |
| Lombok | Boilerplate reduction |
| Swagger/OpenAPI | API documentation |
| IntelliJ IDEA | Development environment |
| Postman | API testing |

## Architecture

The application follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL Database

Security flow:

Login
  ↓
AuthenticationManager
  ↓
JWT Token
  ↓
JWT Authentication Filter
  ↓
SecurityContext
  ↓
Role Authorization
  ↓
Ownership Validation

Project Structure
com.erp.smartbusiness
├── config
│   ├── SecurityConfig
│   ├── JwtAuthenticationFilter
│   └── OpenApiConfig
│
├── controller
│   ├── AuthController
│   ├── UserController
│   ├── EmployeeController
│   ├── ProjectController
│   ├── TaskController
│   ├── LeaveController
│   ├── AttendanceController
│   ├── AssetController
│   └── DashboardController
│
├── dto
│   ├── LoginRequest
│   ├── LoginResponse
│   ├── UserRequest
│   ├── UserResponse
│   ├── PasswordResetRequest
│   ├── EmployeeRequest
│   ├── ProjectRequest
│   ├── TaskRequest
│   ├── LeaveRequest
│   ├── AttendanceRequest
│   ├── AssetRequest
│   └── DashboardResponse
│
├── entity
│   ├── User
│   ├── Employee
│   ├── Project
│   ├── Task
│   ├── Leave
│   ├── Attendance
│   └── Asset
│
├── repository
│
├── service
│
└── exception