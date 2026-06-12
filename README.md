# 🐳 Docker & Kubernetes Learning Platform

A comprehensive interactive educational web application designed to teach Docker and Kubernetes from beginner to advanced, with AI-powered assistance.

---

## 🏗️ Project Architecture & Structure

This repository is set up as a monorepo containing all services:

| Directory | Purpose |
|:----------|:--------|
| `frontend/` | Next.js (TypeScript & TailwindCSS v4) — Student-facing dashboard, courses, and interactive playground |
| `backend/` | NestJS (TypeScript & Prisma ORM) — API Gateway handling auth, progress, and database persistence |
| `ai-service/` | AI microservice for explanation generation, manifest building, and troubleshooting |
| `labs/` | Sandbox configuration schemas, CLI exercises, and interactive playground logic |
| `k8s/` | Kubernetes manifests for deploying the system to production (GCP/AWS) |
| `docs/` | Project plans, system architecture, database diagrams, and API design specifications |

---

## 🛠️ Local Development Setup

### Prerequisites
* [Docker & Docker Compose](https://docs.docker.com/get-docker/) (v2+)
* [Node.js](https://nodejs.org/) (v18+)

### 1. Clone and enter the project
```bash
git clone <your-repo-url>
cd docker-learning-platform
```

### 2. Start infrastructure services (PostgreSQL & Redis)
```bash
docker compose up -d
```
Wait for the healthchecks to pass:
```bash
docker compose ps   # Both db and redis should show "healthy"
```

### 3. Set up the Backend
```bash
cd backend

# Create your local environment file
cp .env.example .env

# Install dependencies
npm install

# Generate the Prisma client and run database migrations
npx prisma generate
npx prisma migrate dev --name init

# Start the backend dev server (port 3001)
npm run start:dev
```

### 4. Set up the Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start the frontend dev server (port 3000)
npm run dev
```

### 5. Verify
* **Frontend**: http://localhost:3000
* **Backend API**: http://localhost:3001/api

---

## 📋 Documentation
Refer to the `docs/` directory for detailed project documentation:
* [Project Plan](docs/project_plan.md) — Vision, phases, and development roadmap
* [Product Requirements (PRD)](docs/prd.md) — User personas, functional & non-functional requirements
* [System Architecture](docs/architecture.md) — Mermaid diagrams, service communication flows, security considerations
* [Database Schema](docs/database_schema.md) — Full Prisma schema with all models and relationships
