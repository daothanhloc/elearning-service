# Course Management Service - eLearning Platform

A microservice for managing courses in an eLearning platform, built with NestJS, TypeScript, PostgreSQL, and Docker.

## 🏗️ Architecture

This service follows **Clean Architecture** principles with a layered structure:

```
src/
├── courses/          # Course module
│   ├── dto/         # Data Transfer Objects
│   ├── course.entity.ts
│   ├── courses.service.ts
│   ├── courses.controller.ts
│   └── courses.module.ts
├── categories/       # Category module
│   ├── dto/
│   ├── category.entity.ts
│   ├── categories.service.ts
│   ├── categories.controller.ts
│   └── categories.module.ts
├── app.module.ts    # Root module
└── main.ts          # Application entry point
```

### Layered Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Presentation Layer                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Controllers (REST API Endpoints, Swagger Docs)       │  │
│  │  - CategoriesController                                │  │
│  │  - CoursesController                                   │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                   Application Layer                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                            │  │
│  │  - CategoriesService                                   │  │
│  │  - CoursesService                                      │  │
│  │                                                        │  │
│  │  DTOs (Data Validation)                               │  │
│  │  - CreateCategoryDto, UpdateCategoryDto               │  │
│  │  - CreateCourseDto, UpdateCourseDto                   │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                      Domain Layer                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Entities (Domain Models)                             │  │
│  │  - Category Entity                                     │  │
│  │  - Course Entity                                       │  │
│  │                                                        │  │
│  │  Relations: Category 1:N Courses                      │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  TypeORM (Database Access)                            │  │
│  │  PostgreSQL Database                                  │  │
│  │  Winston Logger                                       │  │
│  │  Configuration Management                             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Architecture Benefits:**

- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Business logic can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new modules and features
- **Dependency Rule**: Dependencies point inward (toward domain)

### Key Features

- **Clean Architecture**: Separation of concerns with entities, DTOs, services, and controllers
- **TypeORM**: Object-Relational Mapping with PostgreSQL
- **Swagger Documentation**: Auto-generated API documentation
- **Comprehensive Logging**: Winston-based logging with file and console outputs
- **Input Validation**: Class-validator for request validation
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Docker Support**: Full containerization with docker-compose

## 📋 Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15.x or higher (or Docker)
- npm or yarn
- Docker & Docker Compose (optional but recommended)

## 🚀 Quick Start

Step 1: Install dependencies

```
npm install
```

Step 2: Use docker to run service

```
docker-compose up -d
```

Step 3: Init database

1. Create db

```
docker exec -i elearning-db  psql -U postgres -c "CREATE DATABASE elearning_courses;"
```

2. Init data

```
docker exec -i elearning-db psql -U postgres -d elearning_courses < scripts/init-database.sql 2>&1 | grep -E "(CREATE|INSERT|ERROR|Database initialized)" | tail -20
```

Done!
Check swagger: http://localhost:3000/api/v1/docs
# elearning-service
