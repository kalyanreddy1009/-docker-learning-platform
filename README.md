# 🐳 Docker & Kubernetes Learning Platform

A comprehensive interactive educational web application designed to teach Docker and Kubernetes from beginner to advanced.

---

## 🏗️ Project Architecture & Structure

This repository is set up as a monorepo containing all services:

* **`frontend/`**: Next.js (TypeScript & TailwindCSS) application providing the student-facing dashboard, courses, and interactive playground.
* **`backend/`**: Node.js (NestJS) API Gateway that handles users, authentication, progress, and database persistence.
* **`ai-service/`**: Python/Node.js microservice containing specialized LLM integrations for explanation generation, manifest building, and troubleshooting.
* **`labs/`**: Sandbox configuration schemas, CLI exercises, and interactive playground logic.
* **`k8s/`**: Kubernetes manifests for deploying the system to production (GCP/AWS).
* **`docs/`**: Project plans, system architecture, database diagrams, and API design specifications.

---

## 🛠️ Local Development Setup

We use **Docker Compose** to manage local development dependencies (such as PostgreSQL and Redis) and run our services concurrently.

### Prerequisites
* Docker & Docker Compose
* Node.js (v18+)

### Steps to Run Locally

1. **Clone the repository and go to the root**:
   ```bash
   cd docker-learning-platform
   ```

2. **Start the database and backend services using Docker Compose**:
   ```bash
   docker compose up -d
   ```

3. **Install dependencies and run frontend locally**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Install dependencies and run backend locally**:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

---

## 📋 Roadmap & Deliverables
Refer to [docs/project_plan.md](docs/project_plan.md) for full project lifecycle planning.
