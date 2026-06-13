import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Clearing old data...");
  await prisma.progress.deleteMany({});
  await prisma.lab.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.course.deleteMany({});

  console.log("🌱 Seeding courses...");

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COURSE 1: Docker 101
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  await prisma.course.create({
    data: {
      title: 'Docker 101: Containers from Scratch',
      slug: 'docker-101',
      description: 'Master containerization from the absolute basics. Learn to build, run, and manage Docker containers, images, networks, and volumes.',
      published: true,
      order: 1,
      modules: {
        create: [
          {
            title: 'Module 1: What are Containers?',
            description: 'Understand the core concepts behind containerization and Docker.',
            order: 1,
            lessons: {
              create: [
                {
                  id: 'd101-m1-l1',
                  title: 'What is Docker?',
                  slug: 'what-is-docker',
                  type: 'TEXT',
                  xpReward: 20,
                  order: 1,
                  content: `# What is Docker?

Docker is an open platform for developing, shipping, and running applications inside lightweight, portable **containers**.

## The Problem Docker Solves

Before containers, deploying software was painful:
- "It works on my machine!" — different environments caused bugs
- Heavy virtual machines wasted resources
- Setting up servers was slow and error-prone

## Virtual Machines vs Containers

| Feature | Virtual Machine | Container |
|---------|----------------|-----------|
| Boot time | Minutes | Seconds |
| Size | Gigabytes | Megabytes |
| OS | Full guest OS | Shares host kernel |
| Isolation | Hardware-level | Process-level |
| Performance | Overhead | Near-native |

## Docker Architecture

Docker uses a **client-server** architecture:

- **Docker Client** (\`docker\` CLI) — sends commands to the daemon
- **Docker Daemon** (\`dockerd\`) — builds, runs, and manages containers
- **Docker Registry** (Docker Hub) — stores and distributes images

\`\`\`
┌─────────┐     ┌─────────────┐     ┌──────────────┐
│  Client  │────▶│   Daemon    │────▶│   Registry   │
│ (docker) │     │ (dockerd)   │     │ (Docker Hub) │
└─────────┘     └─────────────┘     └──────────────┘
\`\`\`

## Key Concepts

- **Image**: A read-only template with instructions for creating a container
- **Container**: A runnable instance of an image
- **Dockerfile**: A text file with instructions to build an image
- **Volume**: Persistent storage for container data
- **Network**: Communication channels between containers

Docker revolutionized how we build and deploy software. Let's dive in!`
                },
                {
                  id: 'd101-m1-l2',
                  title: 'Installing Docker',
                  slug: 'installing-docker',
                  type: 'TEXT',
                  xpReward: 20,
                  order: 2,
                  content: `# Installing Docker

## Docker Desktop vs Docker Engine

- **Docker Desktop** — GUI application for Mac and Windows. Includes Docker Engine, CLI, Compose, and Kubernetes.
- **Docker Engine** — The core runtime for Linux servers. Lightweight, CLI-only.

## Installation on Linux (Ubuntu/Debian)

\`\`\`bash
# Update packages
sudo apt-get update

# Install prerequisites
sudo apt-get install ca-certificates curl gnupg

# Add Docker's GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add the repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list

# Install Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
\`\`\`

## Verify Installation

\`\`\`bash
docker version
docker run hello-world
\`\`\`

## Post-Installation (Linux)

Run Docker without \`sudo\`:
\`\`\`bash
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect
\`\`\`

## macOS & Windows

1. Download **Docker Desktop** from [docker.com](https://docker.com)
2. Run the installer
3. Start Docker Desktop
4. Open a terminal and run \`docker version\`

That's it! You're ready to start containerizing.`
                },
                {
                  id: 'd101-m1-l3',
                  title: 'Your First Container',
                  slug: 'first-container',
                  type: 'LAB',
                  xpReward: 50,
                  order: 3,
                  content: `# Lab: Your First Container

In this hands-on lab, you'll run your very first Docker container!

## Task 1: Run Hello World

The \`hello-world\` image is a tiny container that prints a welcome message and exits.

\`\`\`bash
docker run hello-world
\`\`\`

This command:
1. Checks for the image locally
2. Pulls it from Docker Hub if not found
3. Creates a container from the image
4. Runs the container, which prints output
5. The container exits

## Task 2: Check Your Containers

List all containers (including stopped ones):

\`\`\`bash
docker ps -a
\`\`\`

You should see the \`hello-world\` container with status "Exited".

> **Tip:** \`docker ps\` (without \`-a\`) only shows running containers.`,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'docker run hello-world' },
                        { type: 'command_run', command: 'docker ps' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 2: Working with Images',
            description: 'Learn how Docker images work and how to build your own.',
            order: 2,
            lessons: {
              create: [
                {
                  id: 'd101-m2-l1',
                  title: 'Understanding Docker Images',
                  slug: 'understanding-images',
                  type: 'TEXT',
                  xpReward: 25,
                  order: 1,
                  content: `# Understanding Docker Images

A Docker image is a **read-only template** containing everything needed to run an application: code, runtime, libraries, and configuration.

## Image Layers

Images are built from **layers**. Each instruction in a Dockerfile creates a new layer:

\`\`\`
┌─────────────────────┐
│  CMD ["node", "app"] │  Layer 4 (8 bytes)
├─────────────────────┤
│  COPY . /app         │  Layer 3 (5 MB)
├─────────────────────┤
│  RUN npm install     │  Layer 2 (50 MB)
├─────────────────────┤
│  FROM node:18-alpine │  Layer 1 (172 MB)
└─────────────────────┘
\`\`\`

Layers are **cached and shared** between images, making builds fast and storage efficient.

## Image Naming Convention

Images follow this format:

\`\`\`
[registry/]repository[:tag]
\`\`\`

Examples:
- \`nginx\` → Docker Hub, \`nginx\` repo, \`latest\` tag
- \`nginx:1.25-alpine\` → Specific version on Alpine base
- \`ghcr.io/myorg/myapp:v2.1\` → GitHub Container Registry

## Key Commands

| Command | Description |
|---------|-------------|
| \`docker images\` | List local images |
| \`docker pull nginx\` | Download an image |
| \`docker rmi nginx\` | Remove an image |
| \`docker image inspect nginx\` | View image details |
| \`docker image prune\` | Remove unused images |

## Image Digests

Every image has a unique SHA256 digest for immutable references:
\`\`\`bash
docker pull nginx@sha256:abc123...
\`\`\``
                },
                {
                  id: 'd101-m2-l2',
                  title: 'The Dockerfile',
                  slug: 'the-dockerfile',
                  type: 'TEXT',
                  xpReward: 25,
                  order: 2,
                  content: `# The Dockerfile

A Dockerfile is a text file containing instructions to build a Docker image. Think of it as a recipe.

## Common Instructions

| Instruction | Purpose | Example |
|-------------|---------|---------|
| \`FROM\` | Base image | \`FROM node:18-alpine\` |
| \`WORKDIR\` | Set working directory | \`WORKDIR /app\` |
| \`COPY\` | Copy files from host | \`COPY package.json ./\` |
| \`ADD\` | Copy + extract archives | \`ADD app.tar.gz /app\` |
| \`RUN\` | Execute during build | \`RUN npm install\` |
| \`ENV\` | Set environment variable | \`ENV NODE_ENV=production\` |
| \`EXPOSE\` | Document port | \`EXPOSE 3000\` |
| \`CMD\` | Default run command | \`CMD ["node", "app.js"]\` |
| \`ENTRYPOINT\` | Fixed run command | \`ENTRYPOINT ["python"]\` |

## Example: Node.js Application

\`\`\`dockerfile
# Use an official lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Document which port the app uses
EXPOSE 3000

# Define the command to start the app
CMD ["node", "server.js"]
\`\`\`

## CMD vs ENTRYPOINT

- **CMD** — default command, can be overridden: \`docker run myapp /bin/bash\`
- **ENTRYPOINT** — fixed command, arguments are appended: \`docker run myapp --verbose\`

## Best Practices

1. **Order matters** — Put rarely changing instructions first for better cache hits
2. **Minimize layers** — Combine related \`RUN\` commands with \`&&\`
3. **Use .dockerignore** — Exclude unnecessary files from the build context
4. **Don't run as root** — Add \`USER node\` for security`
                },
                {
                  id: 'd101-m2-l3',
                  title: 'Build Your First Image',
                  slug: 'build-first-image',
                  type: 'LAB',
                  xpReward: 60,
                  order: 3,
                  content: `# Lab: Build Your First Image

Time to build your own Docker image!

## Task 1: Inspect the Dockerfile

Check the Dockerfile in the current directory:
\`\`\`bash
cat Dockerfile
\`\`\`

## Task 2: Build the Image

Build the image and tag it as \`my-app\`:
\`\`\`bash
docker build -t my-app .
\`\`\`

The \`-t\` flag assigns a name (tag) to the image. The \`.\` tells Docker to use the current directory as the build context.

Watch the output — each step creates a layer!

## Task 3: Verify Your Image

List all local images to confirm yours was created:
\`\`\`bash
docker images
\`\`\`

You should see \`my-app\` with the \`latest\` tag.`,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'docker build' },
                        { type: 'command_run', command: 'docker images' }
                      ]
                    }
                  }
                },
                {
                  id: 'd101-m2-l4',
                  title: 'Image Management',
                  slug: 'image-management',
                  type: 'LAB',
                  xpReward: 40,
                  order: 4,
                  content: `# Lab: Image Management

Learn to pull, list, and manage Docker images.

## Task 1: Pull an Image

Download the official Nginx web server image:
\`\`\`bash
docker pull nginx
\`\`\`

## Task 2: List Images

View all images on your system:
\`\`\`bash
docker images
\`\`\`

Note the image ID, size, and creation date.

## Task 3: Inspect an Image (Bonus)

Get detailed info about the nginx image:
\`\`\`bash
docker inspect nginx
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'docker pull' },
                        { type: 'command_run', command: 'docker images' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 3: Container Lifecycle',
            description: 'Master the lifecycle of Docker containers — run, stop, exec, and manage.',
            order: 3,
            lessons: {
              create: [
                {
                  id: 'd101-m3-l1',
                  title: 'Container States',
                  slug: 'container-states',
                  type: 'TEXT',
                  xpReward: 25,
                  order: 1,
                  content: `# Container States

A Docker container moves through several states during its lifecycle:

\`\`\`
Created ──▶ Running ──▶ Paused
                │          │
                ▼          ▼
             Stopped ◀── Running
                │
                ▼
             Removed
\`\`\`

## Key Commands

| Command | Description |
|---------|-------------|
| \`docker create nginx\` | Create but don't start |
| \`docker start <id>\` | Start a stopped container |
| \`docker stop <id>\` | Gracefully stop (SIGTERM) |
| \`docker kill <id>\` | Force stop (SIGKILL) |
| \`docker restart <id>\` | Stop + Start |
| \`docker pause <id>\` | Freeze processes |
| \`docker unpause <id>\` | Resume processes |
| \`docker rm <id>\` | Remove a stopped container |

## Run vs Create+Start

\`docker run\` = \`docker create\` + \`docker start\` in one step.

\`\`\`bash
# One-step
docker run nginx

# Two-step (same result)
docker create nginx
docker start <container_id>
\`\`\`

## Auto-Remove

Use \`--rm\` to automatically remove a container when it exits:
\`\`\`bash
docker run --rm hello-world
\`\`\`

## Naming Containers

Give containers memorable names:
\`\`\`bash
docker run --name web-server nginx
docker stop web-server
docker rm web-server
\`\`\``
                },
                {
                  id: 'd101-m3-l2',
                  title: 'Interactive Containers',
                  slug: 'interactive-containers',
                  type: 'TEXT',
                  xpReward: 30,
                  order: 2,
                  content: `# Interactive Containers

## Foreground vs Background

### Foreground (default)
\`\`\`bash
docker run nginx
# Terminal is attached — Ctrl+C stops the container
\`\`\`

### Background (detached)
\`\`\`bash
docker run -d nginx
# Returns container ID, terminal is free
\`\`\`

## Interactive Mode

The \`-it\` flags give you an interactive terminal inside a container:
- \`-i\` (interactive) — keeps STDIN open
- \`-t\` (tty) — allocates a pseudo-terminal

\`\`\`bash
# Start a bash shell inside Ubuntu
docker run -it ubuntu bash

# You're now INSIDE the container!
root@abc123:/# ls
root@abc123:/# exit
\`\`\`

## Exec Into Running Containers

Use \`docker exec\` to run commands inside a **running** container:

\`\`\`bash
# Start nginx in background
docker run -d --name web nginx

# Open a shell inside it
docker exec -it web bash

# Run a single command
docker exec web cat /etc/nginx/nginx.conf
\`\`\`

## Viewing Logs

\`\`\`bash
# View all logs
docker logs web

# Follow logs in real-time
docker logs -f web

# Last 50 lines
docker logs --tail 50 web
\`\`\`

## Attaching to a Container

\`\`\`bash
# Re-attach to a running container
docker attach web
# Ctrl+P, Ctrl+Q to detach without stopping
\`\`\``
                },
                {
                  id: 'd101-m3-l3',
                  title: 'Managing Containers',
                  slug: 'managing-containers',
                  type: 'LAB',
                  xpReward: 60,
                  order: 3,
                  content: `# Lab: Managing Containers

Practice the full container lifecycle!

## Task 1: Run in Detached Mode

Start an Nginx container in the background:
\`\`\`bash
docker run -d --name webserver nginx
\`\`\`

The \`-d\` flag runs the container in detached mode.

## Task 2: Exec Into the Container

Open a shell inside the running container:
\`\`\`bash
docker exec -it webserver bash
\`\`\`

## Task 3: View Logs

Check what the web server is doing:
\`\`\`bash
docker logs webserver
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'docker run -d' },
                        { type: 'command_run', command: 'docker exec' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 4: Networking',
            description: 'Connect containers together with Docker networks.',
            order: 4,
            lessons: {
              create: [
                {
                  id: 'd101-m4-l1',
                  title: 'Docker Networking',
                  slug: 'docker-networking',
                  type: 'TEXT',
                  xpReward: 30,
                  order: 1,
                  content: `# Docker Networking

## Network Drivers

Docker provides several network drivers:

| Driver | Description | Use Case |
|--------|-------------|----------|
| \`bridge\` | Default. Isolated network on the host | Single-host container communication |
| \`host\` | Shares host network stack | Maximum network performance |
| \`none\` | No networking | Fully isolated containers |
| \`overlay\` | Multi-host networking | Docker Swarm services |

## Port Mapping

Containers are isolated by default. Use \`-p\` to expose ports:

\`\`\`bash
# Map host port 8080 to container port 80
docker run -d -p 8080:80 nginx

# Map to a random port
docker run -d -p 80 nginx

# Map to a specific interface
docker run -d -p 127.0.0.1:8080:80 nginx
\`\`\`

## Custom Networks

The default \`bridge\` network doesn't support DNS. Create a custom network for automatic DNS resolution:

\`\`\`bash
# Create a custom network
docker network create my-app-net

# Run containers on it
docker run -d --name api --network my-app-net node-api
docker run -d --name db --network my-app-net postgres

# 'api' can now reach 'db' by hostname!
docker exec api ping db
\`\`\`

## Useful Commands

\`\`\`bash
docker network ls              # List networks
docker network inspect bridge  # View network details
docker network create mynet    # Create a network
docker network rm mynet        # Remove a network
docker network connect mynet container1  # Connect container
\`\`\``
                },
                {
                  id: 'd101-m4-l2',
                  title: 'Connect Two Containers',
                  slug: 'connect-containers',
                  type: 'LAB',
                  xpReward: 60,
                  order: 2,
                  content: `# Lab: Connect Two Containers

Create a custom network and make containers communicate!

## Task 1: Create a Network

\`\`\`bash
docker network create lab-net
\`\`\`

## Task 2: Run Containers on the Network

Start two containers on your new network:
\`\`\`bash
docker run -d --name web --network lab-net nginx
\`\`\`

## Task 3: Verify Connectivity

Ping the web container by its name:
\`\`\`bash
docker exec web hostname
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'docker network create' },
                        { type: 'command_run', command: 'docker run' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 5: Volumes & Storage',
            description: 'Persist data beyond the container lifecycle.',
            order: 5,
            lessons: {
              create: [
                {
                  id: 'd101-m5-l1',
                  title: 'Persistent Storage',
                  slug: 'persistent-storage',
                  type: 'TEXT',
                  xpReward: 25,
                  order: 1,
                  content: `# Persistent Storage

Containers are **ephemeral** — when you remove a container, all data inside it is lost. Volumes solve this.

## Storage Types

### 1. Named Volumes (Recommended)
Managed by Docker. Best for persistent data like databases.
\`\`\`bash
docker volume create my-data
docker run -v my-data:/app/data nginx
\`\`\`

### 2. Bind Mounts
Map a host directory into a container. Best for development.
\`\`\`bash
docker run -v /host/path:/container/path nginx
docker run -v $(pwd):/app node:18
\`\`\`

### 3. tmpfs Mounts
In-memory storage. Gone when container stops.
\`\`\`bash
docker run --tmpfs /app/cache nginx
\`\`\`

## Volume Commands

| Command | Description |
|---------|-------------|
| \`docker volume create db-data\` | Create a volume |
| \`docker volume ls\` | List all volumes |
| \`docker volume inspect db-data\` | View volume details |
| \`docker volume rm db-data\` | Remove a volume |
| \`docker volume prune\` | Remove unused volumes |

## Real-World Example: PostgreSQL

\`\`\`bash
# Create a volume for database files
docker volume create pgdata

# Run PostgreSQL with persistent storage
docker run -d \\
  --name postgres \\
  -e POSTGRES_PASSWORD=secret \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:15

# Even if you remove and recreate the container,
# your database files persist in the 'pgdata' volume!
\`\`\``
                },
                {
                  id: 'd101-m5-l2',
                  title: 'Working with Volumes',
                  slug: 'working-volumes',
                  type: 'LAB',
                  xpReward: 60,
                  order: 2,
                  content: `# Lab: Working with Volumes

Practice creating and mounting Docker volumes.

## Task 1: Create a Volume

\`\`\`bash
docker volume create app-data
\`\`\`

## Task 2: Mount It to a Container

Run a container with the volume mounted:
\`\`\`bash
docker run -v app-data:/data nginx
\`\`\`

## Task 3: Verify

List your volumes to confirm:
\`\`\`bash
docker volume ls
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'docker volume create' },
                        { type: 'command_run', command: 'docker run -v' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 6: Docker Compose',
            description: 'Define and run multi-container applications.',
            order: 6,
            lessons: {
              create: [
                {
                  id: 'd101-m6-l1',
                  title: 'Introduction to Compose',
                  slug: 'intro-compose',
                  type: 'TEXT',
                  xpReward: 30,
                  order: 1,
                  content: `# Introduction to Docker Compose

Docker Compose lets you define and run **multi-container applications** with a single YAML file.

## Why Compose?

Running a full-stack app manually:
\`\`\`bash
docker network create myapp
docker run -d --name db --network myapp -e POSTGRES_PASSWORD=secret postgres
docker run -d --name api --network myapp -p 3000:3000 --link db myapi
docker run -d --name web --network myapp -p 80:80 mynginx
\`\`\`

With Compose, it's one command: \`docker-compose up\`

## The docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  web:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api

  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret

volumes:
  pgdata:
\`\`\`

## Key Commands

| Command | Description |
|---------|-------------|
| \`docker-compose up\` | Start all services |
| \`docker-compose up -d\` | Start in background |
| \`docker-compose down\` | Stop and remove everything |
| \`docker-compose ps\` | List running services |
| \`docker-compose logs\` | View logs |
| \`docker-compose build\` | Rebuild images |`
                },
                {
                  id: 'd101-m6-l2',
                  title: 'Multi-Container Apps',
                  slug: 'multi-container-apps',
                  type: 'TEXT',
                  xpReward: 35,
                  order: 2,
                  content: `# Building Multi-Container Applications

## Real-World Architecture

A typical web application has 3 tiers:

\`\`\`
┌─────────┐     ┌─────────┐     ┌──────────┐
│  Nginx   │────▶│ Node.js │────▶│ Postgres │
│ (proxy)  │     │  (API)  │     │   (DB)   │
└─────────┘     └─────────┘     └──────────┘
    :80            :3000           :5432
\`\`\`

## Complete Example

\`\`\`yaml
version: '3.8'

services:
  # Reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
    restart: unless-stopped

  # Application server
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: myapp
      DB_USER: appuser
      DB_PASS: \${DB_PASSWORD}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  # Database
  db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  db-data:
\`\`\`

## Environment Variables

Use a \`.env\` file for secrets:
\`\`\`
DB_PASSWORD=my-super-secret-password
\`\`\`

## Service Dependencies

\`depends_on\` controls startup order. With health checks, you can wait until a service is truly ready.`
                },
                {
                  id: 'd101-m6-l3',
                  title: 'Deploy with Compose',
                  slug: 'deploy-compose',
                  type: 'LAB',
                  xpReward: 70,
                  order: 3,
                  content: `# Lab: Deploy with Docker Compose

Launch a multi-container application!

## Task 1: Check the Compose File

\`\`\`bash
cat docker-compose.yml
\`\`\`

## Task 2: Launch the Stack

Start all services:
\`\`\`bash
docker-compose up -d
\`\`\`

## Task 3: Verify

Check that all services are running:
\`\`\`bash
docker-compose ps
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'docker-compose up' }
                      ]
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("  ✅ Docker 101 created");

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COURSE 2: Docker Advanced
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  await prisma.course.create({
    data: {
      title: 'Docker Advanced: Production Patterns',
      slug: 'docker-advanced',
      description: 'Take your Docker skills to production. Master multi-stage builds, security best practices, and CI/CD pipelines.',
      published: true,
      order: 2,
      modules: {
        create: [
          {
            title: 'Module 1: Advanced Dockerfile Patterns',
            description: 'Optimize images with multi-stage builds and caching strategies.',
            order: 1,
            lessons: {
              create: [
                {
                  id: 'dadv-m1-l1',
                  title: 'Multi-Stage Builds',
                  slug: 'multi-stage-builds',
                  type: 'TEXT',
                  xpReward: 35,
                  order: 1,
                  content: `# Multi-Stage Builds

Multi-stage builds dramatically reduce image size by separating the **build environment** from the **runtime environment**.

## The Problem

A typical Node.js build image includes: Node.js, npm, build tools, dev dependencies, source code — often 1GB+. But the final app only needs the compiled output and production deps.

## Solution: Multi-Stage Dockerfile

\`\`\`dockerfile
# ── Stage 1: Build ──────────────────────
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Production ────────────────
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
\`\`\`

## Size Comparison

| Stage | Base Image | Final Size |
|-------|-----------|------------|
| Single-stage | \`node:18\` | ~1.2 GB |
| Multi-stage | \`node:18-alpine\` | ~180 MB |
| Distroless | \`gcr.io/distroless/nodejs18\` | ~120 MB |

## Go Example (Even More Dramatic)

\`\`\`dockerfile
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o server .

FROM scratch
COPY --from=builder /app/server /server
CMD ["/server"]
# Final image: ~10 MB!
\`\`\`

## Building Specific Stages

\`\`\`bash
# Build only the builder stage
docker build --target builder -t myapp-build .

# Build the final production stage
docker build --target production -t myapp .
\`\`\``
                },
                {
                  id: 'dadv-m1-l2',
                  title: 'Build Cache & Optimization',
                  slug: 'build-cache-optimization',
                  type: 'TEXT',
                  xpReward: 30,
                  order: 2,
                  content: `# Build Cache & Optimization

## Layer Caching Rules

Docker caches each layer. If a layer hasn't changed, Docker reuses it. **But once a layer changes, all subsequent layers are rebuilt.**

### ❌ Bad: Invalidates cache on every code change
\`\`\`dockerfile
COPY . .
RUN npm install
\`\`\`

### ✅ Good: Dependencies cached separately
\`\`\`dockerfile
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
\`\`\`

## .dockerignore

Prevent unnecessary files from entering the build context:

\`\`\`
node_modules
.git
.env
*.md
.DS_Store
dist
coverage
.next
\`\`\`

## Minimize Layers

Combine related commands:
\`\`\`dockerfile
# ❌ 3 layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# ✅ 1 layer
RUN apt-get update && \\
    apt-get install -y --no-install-recommends curl && \\
    apt-get clean && rm -rf /var/lib/apt/lists/*
\`\`\`

## Choosing Base Images

| Image | Size | Best For |
|-------|------|----------|
| \`ubuntu:22.04\` | 77 MB | General purpose |
| \`alpine:3.18\` | 7 MB | Minimal containers |
| \`node:18-alpine\` | 172 MB | Node.js apps |
| \`distroless\` | ~20 MB | Maximum security |
| \`scratch\` | 0 MB | Static binaries (Go, Rust) |`
                },
                {
                  id: 'dadv-m1-l3',
                  title: 'Optimize an Image',
                  slug: 'optimize-image',
                  type: 'LAB',
                  xpReward: 70,
                  order: 3,
                  content: `# Lab: Optimize an Image

Practice building optimized multi-stage images.

## Task: Build with a Target Stage

Build just the production stage of a multi-stage Dockerfile:

\`\`\`bash
docker build --target production -t my-app .
\`\`\`

Then verify the image was created:
\`\`\`bash
docker images
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'docker build --target' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 2: Security Best Practices',
            description: 'Harden your containers for production workloads.',
            order: 2,
            lessons: {
              create: [
                {
                  id: 'dadv-m2-l1',
                  title: 'Container Security',
                  slug: 'container-security',
                  type: 'TEXT',
                  xpReward: 35,
                  order: 1,
                  content: `# Container Security

## The Security Mindset

Containers provide **process isolation**, not full security boundaries. Follow these principles:

### 1. Don't Run as Root

\`\`\`dockerfile
FROM node:18-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /home/appuser/app
COPY --chown=appuser:appgroup . .
CMD ["node", "server.js"]
\`\`\`

### 2. Read-Only Filesystem

\`\`\`bash
docker run --read-only --tmpfs /tmp nginx
\`\`\`

### 3. Drop Capabilities

\`\`\`bash
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx
\`\`\`

### 4. Resource Limits

\`\`\`bash
docker run --memory=512m --cpus=1.0 myapp
\`\`\`

### 5. No Privilege Escalation

\`\`\`bash
docker run --security-opt=no-new-privileges myapp
\`\`\`

## Secrets Management

**Never** put secrets in images or environment variables in Dockerfiles.

\`\`\`bash
# ❌ BAD: Secret baked into image
ENV API_KEY=sk-12345

# ✅ GOOD: Pass at runtime
docker run -e API_KEY=sk-12345 myapp

# ✅ BETTER: Use Docker secrets or a vault
\`\`\`

## Image Scanning

Scan images for known vulnerabilities:
\`\`\`bash
docker scout cves myapp:latest
# or
trivy image myapp:latest
\`\`\``
                },
                {
                  id: 'dadv-m2-l2',
                  title: 'Secure a Container',
                  slug: 'secure-container',
                  type: 'LAB',
                  xpReward: 70,
                  order: 2,
                  content: `# Lab: Secure a Container

Practice running containers with security hardening.

## Task 1: Run as Non-Root

Run nginx as a non-root user:
\`\`\`bash
docker run --user 1000:1000 nginx
\`\`\`

## Task 2: Read-Only Filesystem

Run a container with a read-only root filesystem:
\`\`\`bash
docker run --read-only --tmpfs /tmp nginx
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'docker run --read-only' },
                        { type: 'command_run', command: 'docker run --user' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 3: Production Deployment',
            description: 'Health checks, logging, monitoring, and CI/CD with Docker.',
            order: 3,
            lessons: {
              create: [
                {
                  id: 'dadv-m3-l1',
                  title: 'Health Checks & Restart Policies',
                  slug: 'healthchecks-restart',
                  type: 'TEXT',
                  xpReward: 35,
                  order: 1,
                  content: `# Health Checks & Restart Policies

## HEALTHCHECK Instruction

Tell Docker how to verify your container is healthy:

\`\`\`dockerfile
FROM nginx:alpine
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD curl -f http://localhost/ || exit 1
\`\`\`

Check health status:
\`\`\`bash
docker inspect --format='{{.State.Health.Status}}' mycontainer
# Output: healthy | unhealthy | starting
\`\`\`

## Restart Policies

| Policy | Description |
|--------|-------------|
| \`no\` | Never restart (default) |
| \`always\` | Always restart, even on manual stop |
| \`on-failure\` | Only restart on non-zero exit |
| \`unless-stopped\` | Restart unless manually stopped |

\`\`\`bash
# Restart on crash
docker run -d --restart on-failure:5 myapp

# Always restart (survives host reboot)
docker run -d --restart unless-stopped myapp
\`\`\`

## Graceful Shutdown

Docker sends \`SIGTERM\` on \`docker stop\`, then \`SIGKILL\` after timeout (default 10s).

Handle SIGTERM in your app:
\`\`\`javascript
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  server.close(() => process.exit(0));
});
\`\`\``
                },
                {
                  id: 'dadv-m3-l2',
                  title: 'Logging & Monitoring',
                  slug: 'logging-monitoring',
                  type: 'TEXT',
                  xpReward: 35,
                  order: 2,
                  content: `# Logging & Monitoring

## Docker Logging

Applications should log to **stdout/stderr**. Docker captures these and routes them to a log driver.

\`\`\`bash
# View logs
docker logs myapp
docker logs -f --tail 100 myapp

# Check log driver
docker inspect --format='{{.HostConfig.LogConfig.Type}}' myapp
\`\`\`

## Log Drivers

| Driver | Description |
|--------|-------------|
| \`json-file\` | Default. JSON files on disk |
| \`syslog\` | Send to syslog |
| \`journald\` | Send to systemd journal |
| \`fluentd\` | Send to Fluentd |
| \`awslogs\` | Send to CloudWatch |

## Monitoring with docker stats

\`\`\`bash
docker stats
docker stats --no-stream --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"
\`\`\`

## Production Monitoring Stack

For production, use **Prometheus + Grafana**:
1. Export metrics from your app (\`/metrics\` endpoint)
2. Prometheus scrapes metrics at regular intervals
3. Grafana visualizes dashboards and alerts

## Resource Limits

\`\`\`bash
docker run -d \\
  --memory=512m \\
  --memory-swap=1g \\
  --cpus=1.5 \\
  --pids-limit=100 \\
  myapp
\`\`\``
                },
                {
                  id: 'dadv-m3-l3',
                  title: 'CI/CD with Docker',
                  slug: 'cicd-docker',
                  type: 'TEXT',
                  xpReward: 40,
                  order: 3,
                  content: `# CI/CD with Docker

## Why Docker in CI/CD?

- **Consistent builds** — Same Dockerfile everywhere
- **Fast pipelines** — Layer caching speeds up builds
- **Easy rollbacks** — Every image is versioned

## GitHub Actions Example

\`\`\`yaml
name: Build and Push
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            myorg/myapp:latest
            myorg/myapp:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
\`\`\`

## Tagging Strategies

| Strategy | Example | Use Case |
|----------|---------|----------|
| Git SHA | \`myapp:abc123f\` | Traceability |
| Semver | \`myapp:v1.2.3\` | Releases |
| Branch | \`myapp:main\` | Latest from branch |
| Date | \`myapp:2026-06-12\` | Daily builds |

## Best Practices

1. **Never use \`latest\` in production** — always pin versions
2. **Scan images in CI** — fail builds on critical vulnerabilities
3. **Use build cache** — dramatically speeds up pipelines
4. **Sign images** — verify image integrity with cosign
5. **Multi-arch builds** — support ARM and x86 with \`docker buildx\``
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("  ✅ Docker Advanced created");

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COURSE 3: Kubernetes 101
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  await prisma.course.create({
    data: {
      title: 'Kubernetes 101: Container Orchestration',
      slug: 'kubernetes-101',
      description: 'Learn Kubernetes from the ground up. Deploy, scale, and manage containerized applications on a cluster.',
      published: true,
      order: 3,
      modules: {
        create: [
          {
            title: 'Module 1: Kubernetes Fundamentals',
            description: 'Understand the Kubernetes architecture and core concepts.',
            order: 1,
            lessons: {
              create: [
                {
                  id: 'k101-m1-l1',
                  title: 'What is Kubernetes?',
                  slug: 'what-is-kubernetes',
                  type: 'TEXT',
                  xpReward: 25,
                  order: 1,
                  content: `# What is Kubernetes?

Kubernetes (K8s) is an open-source **container orchestration platform** that automates deploying, scaling, and managing containerized applications.

## The Problem

Docker runs containers on a single machine. But in production you need:
- Run across **multiple servers** for reliability
- **Auto-scale** based on demand
- **Self-heal** when containers crash
- **Zero-downtime deployments**
- **Service discovery** between containers

Kubernetes solves all of these.

## Architecture

\`\`\`
┌─── Control Plane ─────────────────────────┐
│  ┌───────────┐  ┌────────────┐            │
│  │ API Server│  │ Scheduler  │            │
│  └───────────┘  └────────────┘            │
│  ┌───────────┐  ┌────────────┐            │
│  │   etcd    │  │ Controller │            │
│  │ (storage) │  │  Manager   │            │
│  └───────────┘  └────────────┘            │
└───────────────────────────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─ Node 1 ──┐ ┌─ Node 2 ──┐
│ kubelet    │ │ kubelet    │
│ kube-proxy │ │ kube-proxy │
│ ┌────────┐ │ │ ┌────────┐ │
│ │ Pod    │ │ │ │ Pod    │ │
│ │ Pod    │ │ │ │ Pod    │ │
│ └────────┘ │ │ └────────┘ │
└────────────┘ └────────────┘
\`\`\`

## Key Components

| Component | Role |
|-----------|------|
| **API Server** | Front door to the cluster. Handles all REST requests |
| **etcd** | Distributed key-value store. The cluster's "database" |
| **Scheduler** | Assigns pods to nodes based on resources |
| **Controller Manager** | Ensures desired state matches actual state |
| **kubelet** | Agent on each node. Runs and monitors pods |
| **kube-proxy** | Network proxy. Handles service routing |

## Key Concepts

- **Pod** — Smallest deployable unit (one or more containers)
- **Deployment** — Manages ReplicaSets and rolling updates
- **Service** — Stable network endpoint for pods
- **Namespace** — Virtual cluster for isolation`
                },
                {
                  id: 'k101-m1-l2',
                  title: 'Setting Up Kubernetes',
                  slug: 'setup-kubernetes',
                  type: 'TEXT',
                  xpReward: 25,
                  order: 2,
                  content: `# Setting Up Kubernetes

## Local Development Options

| Tool | Description | Best For |
|------|-------------|----------|
| **Minikube** | Single-node cluster in a VM | Learning, testing |
| **kind** | Kubernetes IN Docker | CI/CD, fast setup |
| **k3s** | Lightweight K8s | Edge, IoT, Raspberry Pi |
| **Docker Desktop** | Built-in K8s | Mac/Windows developers |

## Installing kubectl

\`kubectl\` is the command-line tool to interact with Kubernetes.

\`\`\`bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# Verify
kubectl version --client
\`\`\`

## Setting Up Minikube

\`\`\`bash
# Install
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start cluster
minikube start

# Verify
kubectl cluster-info
kubectl get nodes
\`\`\`

## kubectl Basics

\`\`\`bash
# View cluster info
kubectl cluster-info

# List nodes
kubectl get nodes

# List all resources
kubectl get all

# Describe a resource
kubectl describe node minikube
\`\`\`

## kubectl Shorthand

| Full | Short |
|------|-------|
| \`pods\` | \`po\` |
| \`services\` | \`svc\` |
| \`deployments\` | \`deploy\` |
| \`namespaces\` | \`ns\` |
| \`configmaps\` | \`cm\` |`
                },
                {
                  id: 'k101-m1-l3',
                  title: 'Your First Cluster',
                  slug: 'first-cluster',
                  type: 'LAB',
                  xpReward: 50,
                  order: 3,
                  content: `# Lab: Your First Cluster

Explore your Kubernetes cluster!

## Task 1: Check Cluster Info

\`\`\`bash
kubectl cluster-info
\`\`\`

## Task 2: List Nodes

\`\`\`bash
kubectl get nodes
\`\`\`

You should see your cluster nodes with "Ready" status.`,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'kubectl cluster-info' },
                        { type: 'command_run', command: 'kubectl get nodes' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 2: Pods & Workloads',
            description: 'Deploy applications with Pods, Deployments, and ReplicaSets.',
            order: 2,
            lessons: {
              create: [
                {
                  id: 'k101-m2-l1',
                  title: 'Understanding Pods',
                  slug: 'understanding-pods',
                  type: 'TEXT',
                  xpReward: 30,
                  order: 1,
                  content: `# Understanding Pods

A **Pod** is the smallest deployable unit in Kubernetes — a wrapper around one or more containers.

## Pod Characteristics

- Containers in a pod share **network** (same IP, same ports)
- Containers in a pod share **storage volumes**
- Pods are **ephemeral** — they can be replaced at any time
- Pods run on a single **node**

## Pod YAML

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: web
    tier: frontend
spec:
  containers:
    - name: web
      image: nginx:1.25
      ports:
        - containerPort: 80
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
\`\`\`

## Pod Lifecycle

\`\`\`
Pending ──▶ Running ──▶ Succeeded
                │
                ▼
              Failed
\`\`\`

| Phase | Description |
|-------|-------------|
| **Pending** | Scheduled but not yet running |
| **Running** | At least one container is running |
| **Succeeded** | All containers exited successfully |
| **Failed** | At least one container failed |

## Multi-Container Patterns

- **Sidecar** — Helper container (e.g., log collector)
- **Ambassador** — Proxy container (e.g., connection pooler)
- **Init Container** — Runs before main container (e.g., database migration)`
                },
                {
                  id: 'k101-m2-l2',
                  title: 'Deployments & ReplicaSets',
                  slug: 'deployments-replicasets',
                  type: 'TEXT',
                  xpReward: 30,
                  order: 2,
                  content: `# Deployments & ReplicaSets

## Why Not Just Use Pods?

Pods alone don't provide:
- **Scaling** — run multiple copies
- **Self-healing** — restart crashed pods
- **Rolling updates** — zero-downtime deployments

**Deployments** solve all of these.

## Deployment YAML

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.25
          ports:
            - containerPort: 80
\`\`\`

## Scaling

\`\`\`bash
# Scale to 5 replicas
kubectl scale deployment nginx-deploy --replicas=5

# Check status
kubectl get pods -l app=nginx
\`\`\`

## Rolling Updates

\`\`\`bash
# Update the image
kubectl set image deployment/nginx-deploy nginx=nginx:1.26

# Watch the rollout
kubectl rollout status deployment/nginx-deploy

# Rollback if something goes wrong
kubectl rollout undo deployment/nginx-deploy
\`\`\`

## How It Works

\`\`\`
Deployment
  └── ReplicaSet (manages pod replicas)
        ├── Pod 1
        ├── Pod 2
        └── Pod 3
\`\`\`

During a rolling update, a new ReplicaSet is created and gradually scales up while the old one scales down.`
                },
                {
                  id: 'k101-m2-l3',
                  title: 'Deploy an Application',
                  slug: 'deploy-application',
                  type: 'LAB',
                  xpReward: 60,
                  order: 3,
                  content: `# Lab: Deploy an Application

Create your first Kubernetes deployment!

## Task 1: Create a Deployment

\`\`\`bash
kubectl create deployment nginx-app --image=nginx:latest
\`\`\`

## Task 2: Verify Pods

\`\`\`bash
kubectl get pods
\`\`\`

You should see a pod in "Running" status.

## Task 3: Scale Up (Bonus)

\`\`\`bash
kubectl scale deployment nginx-app --replicas=3
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'kubectl create deployment' },
                        { type: 'command_run', command: 'kubectl get pods' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 3: Services & Networking',
            description: 'Expose your applications to the network.',
            order: 3,
            lessons: {
              create: [
                {
                  id: 'k101-m3-l1',
                  title: 'Kubernetes Services',
                  slug: 'kubernetes-services',
                  type: 'TEXT',
                  xpReward: 30,
                  order: 1,
                  content: `# Kubernetes Services

Pods are ephemeral — their IPs change. A **Service** provides a stable endpoint to reach your pods.

## Service Types

| Type | Description | Access |
|------|-------------|--------|
| **ClusterIP** | Internal only (default) | Within cluster |
| **NodePort** | Exposes on each node's IP | External via node |
| **LoadBalancer** | Cloud load balancer | External via LB |
| **ExternalName** | DNS alias | Maps to external DNS |

## ClusterIP (Default)

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-api
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
\`\`\`

Other pods reach it at: \`http://my-api:80\`

## NodePort

\`\`\`yaml
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 3000
      nodePort: 30080  # 30000-32767
\`\`\`

Access externally at: \`http://<node-ip>:30080\`

## Service Discovery

Kubernetes automatically creates DNS entries:
\`\`\`
<service-name>.<namespace>.svc.cluster.local

# Examples:
my-api.default.svc.cluster.local
postgres.database.svc.cluster.local
\`\`\``
                },
                {
                  id: 'k101-m3-l2',
                  title: 'Expose Your App',
                  slug: 'expose-app',
                  type: 'LAB',
                  xpReward: 60,
                  order: 2,
                  content: `# Lab: Expose Your App

Create a service to make your deployment accessible!

## Task 1: Expose the Deployment

\`\`\`bash
kubectl expose deployment nginx-app --port=80 --type=NodePort
\`\`\`

## Task 2: Verify the Service

\`\`\`bash
kubectl get services
\`\`\`

You should see your service with a NodePort assigned.`,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'kubectl expose' },
                        { type: 'command_run', command: 'kubectl get services' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 4: Configuration & Storage',
            description: 'Manage application config and persistent data.',
            order: 4,
            lessons: {
              create: [
                {
                  id: 'k101-m4-l1',
                  title: 'ConfigMaps & Secrets',
                  slug: 'configmaps-secrets',
                  type: 'TEXT',
                  xpReward: 25,
                  order: 1,
                  content: `# ConfigMaps & Secrets

## ConfigMaps

Store non-sensitive configuration data as key-value pairs.

\`\`\`bash
# Create from literal
kubectl create configmap app-config \\
  --from-literal=DB_HOST=postgres \\
  --from-literal=DB_PORT=5432

# Create from file
kubectl create configmap nginx-conf --from-file=nginx.conf
\`\`\`

### Use in a Pod

\`\`\`yaml
spec:
  containers:
    - name: app
      image: myapp
      envFrom:
        - configMapRef:
            name: app-config
      # Or mount as files:
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: app-config
\`\`\`

## Secrets

Store sensitive data (passwords, tokens, keys). Base64-encoded (not encrypted by default!).

\`\`\`bash
kubectl create secret generic db-creds \\
  --from-literal=username=admin \\
  --from-literal=password=s3cret!
\`\`\`

### Use in a Pod

\`\`\`yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-creds
        key: password
\`\`\`

## Best Practices

- **Never** commit secrets to git
- Use **external secret managers** (Vault, AWS Secrets Manager)
- Enable **encryption at rest** for secrets in etcd`
                },
                {
                  id: 'k101-m4-l2',
                  title: 'Configure Your App',
                  slug: 'configure-app',
                  type: 'LAB',
                  xpReward: 60,
                  order: 2,
                  content: `# Lab: Configure Your App

Create and use a ConfigMap.

## Task 1: Create a ConfigMap

\`\`\`bash
kubectl create configmap app-settings --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info
\`\`\`

## Task 2: Verify

\`\`\`bash
kubectl describe configmap app-settings
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'kubectl create configmap' },
                        { type: 'command_run', command: 'kubectl describe' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 5: Namespaces & RBAC',
            description: 'Organize and secure your cluster with namespaces and access control.',
            order: 5,
            lessons: {
              create: [
                {
                  id: 'k101-m5-l1',
                  title: 'Namespaces',
                  slug: 'namespaces',
                  type: 'TEXT',
                  xpReward: 25,
                  order: 1,
                  content: `# Namespaces

Namespaces provide **logical isolation** within a cluster. Think of them as virtual clusters.

## Default Namespaces

| Namespace | Purpose |
|-----------|---------|
| \`default\` | Where resources go if no namespace is specified |
| \`kube-system\` | System components (CoreDNS, metrics-server) |
| \`kube-public\` | Publicly readable resources |
| \`kube-node-lease\` | Node heartbeat data |

## Working with Namespaces

\`\`\`bash
# List namespaces
kubectl get namespaces

# Create a namespace
kubectl create namespace staging

# Deploy to a namespace
kubectl create deployment web --image=nginx -n staging

# List pods in a namespace
kubectl get pods -n staging

# List pods in ALL namespaces
kubectl get pods -A
\`\`\`

## Resource Quotas

Limit resources per namespace:
\`\`\`yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
  namespace: staging
spec:
  hard:
    pods: "20"
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
\`\`\`

## When to Use Namespaces

- **Environment separation**: dev, staging, production
- **Team isolation**: team-a, team-b
- **Application grouping**: frontend, backend, database`
                },
                {
                  id: 'k101-m5-l2',
                  title: 'Namespace Isolation',
                  slug: 'namespace-isolation',
                  type: 'LAB',
                  xpReward: 50,
                  order: 2,
                  content: `# Lab: Namespace Isolation

Create a namespace and deploy into it.

## Task 1: Create a Namespace

\`\`\`bash
kubectl create namespace dev-team
\`\`\`

## Task 2: Deploy Into It

\`\`\`bash
kubectl create deployment web --image=nginx -n dev-team
\`\`\`

## Task 3: Verify

\`\`\`bash
kubectl get pods -n dev-team
\`\`\``,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'kubectl create namespace' },
                        { type: 'command_run', command: 'kubectl get pods -n' }
                      ]
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("  ✅ Kubernetes 101 created");

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COURSE 4: Kubernetes Advanced
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  await prisma.course.create({
    data: {
      title: 'Kubernetes Advanced: Production Grade',
      slug: 'kubernetes-advanced',
      description: 'Production-grade Kubernetes. Helm charts, observability, auto-scaling, service mesh, and GitOps.',
      published: true,
      order: 4,
      modules: {
        create: [
          {
            title: 'Module 1: Helm & Package Management',
            description: 'Deploy complex applications with Helm charts.',
            order: 1,
            lessons: {
              create: [
                {
                  id: 'kadv-m1-l1',
                  title: 'Introduction to Helm',
                  slug: 'intro-helm',
                  type: 'TEXT',
                  xpReward: 35,
                  order: 1,
                  content: `# Introduction to Helm

Helm is the **package manager for Kubernetes** — think apt/brew but for K8s.

## Why Helm?

Deploying a real app might need: Deployment, Service, ConfigMap, Secret, Ingress, PVC, ServiceAccount, RBAC... That's dozens of YAML files!

Helm packages all of these into a **Chart** — a single installable unit.

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Chart** | A package of K8s resources (like an npm package) |
| **Release** | An installed instance of a chart |
| **Repository** | A collection of charts |
| **Values** | Configuration for customizing a chart |

## Helm Commands

\`\`\`bash
# Add a repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search for charts
helm search repo nginx

# Install a chart
helm install my-nginx bitnami/nginx

# List releases
helm list

# Upgrade a release
helm upgrade my-nginx bitnami/nginx --set replicaCount=3

# Uninstall
helm uninstall my-nginx
\`\`\`

## Custom Values

Override defaults with a \`values.yaml\`:
\`\`\`yaml
replicaCount: 3
image:
  repository: nginx
  tag: "1.25"
service:
  type: LoadBalancer
  port: 80
resources:
  limits:
    cpu: 100m
    memory: 128Mi
\`\`\`

\`\`\`bash
helm install my-nginx bitnami/nginx -f values.yaml
\`\`\``
                },
                {
                  id: 'kadv-m1-l2',
                  title: 'Deploy with Helm',
                  slug: 'deploy-helm',
                  type: 'LAB',
                  xpReward: 70,
                  order: 2,
                  content: `# Lab: Deploy with Helm

Install an application using Helm.

## Task 1: Install a Chart

\`\`\`bash
helm install my-release bitnami/nginx
\`\`\`

## Task 2: Verify the Release

\`\`\`bash
helm list
\`\`\`

You should see your release with "deployed" status.`,
                  lab: {
                    create: {
                      validationRules: [
                        { type: 'command_run', command: 'helm install' },
                        { type: 'command_run', command: 'helm list' }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            title: 'Module 2: Observability',
            description: 'Monitor, log, and trace your applications in production.',
            order: 2,
            lessons: {
              create: [
                {
                  id: 'kadv-m2-l1',
                  title: 'Monitoring with Prometheus',
                  slug: 'monitoring-prometheus',
                  type: 'TEXT',
                  xpReward: 35,
                  order: 1,
                  content: `# Monitoring with Prometheus

## The Observability Stack

\`\`\`
┌──────────┐     ┌────────────┐     ┌─────────┐
│   App    │────▶│ Prometheus │────▶│ Grafana  │
│ /metrics │     │  (scrape)  │     │ (visual) │
└──────────┘     └────────────┘     └─────────┘
                       │
                  ┌────┴────┐
                  │Alertmanager│
                  └──────────┘
\`\`\`

## How Prometheus Works

1. Apps expose metrics at \`/metrics\` endpoint
2. Prometheus **scrapes** these endpoints at regular intervals
3. Metrics are stored in a time-series database
4. **Grafana** queries Prometheus to build dashboards
5. **Alertmanager** sends notifications when thresholds are breached

## Key Metrics

| Metric Type | Example | Use |
|-------------|---------|-----|
| Counter | \`http_requests_total\` | Total count (always increases) |
| Gauge | \`memory_usage_bytes\` | Current value (goes up and down) |
| Histogram | \`request_duration_seconds\` | Distribution of values |

## PromQL Examples

\`\`\`promql
# Request rate (per second) over 5 minutes
rate(http_requests_total[5m])

# 95th percentile latency
histogram_quantile(0.95, rate(request_duration_seconds_bucket[5m]))

# Memory usage percentage
(node_memory_Active_bytes / node_memory_MemTotal_bytes) * 100
\`\`\`

## Install with Helm

\`\`\`bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack
\`\`\``
                },
                {
                  id: 'kadv-m2-l2',
                  title: 'Logging with EFK Stack',
                  slug: 'logging-efk',
                  type: 'TEXT',
                  xpReward: 30,
                  order: 2,
                  content: `# Logging with EFK Stack

## Components

| Component | Role |
|-----------|------|
| **Elasticsearch** | Stores and indexes logs |
| **Fluentd** | Collects and ships logs from nodes |
| **Kibana** | Web UI for searching and visualizing logs |

## How It Works

\`\`\`
Pod stdout/stderr
     │
     ▼
 Node log files (/var/log/containers/)
     │
     ▼
 Fluentd (DaemonSet on each node)
     │
     ▼
 Elasticsearch (indexing & storage)
     │
     ▼
 Kibana (search & visualize)
\`\`\`

## Structured Logging

Always log in JSON format for easier parsing:
\`\`\`json
{
  "timestamp": "2026-06-12T18:00:00Z",
  "level": "info",
  "message": "User logged in",
  "userId": "abc123",
  "ip": "10.0.0.1",
  "duration_ms": 45
}
\`\`\`

## Best Practices

1. **Log to stdout/stderr** — Kubernetes captures these automatically
2. **Use structured logging** — JSON is machine-parseable
3. **Include correlation IDs** — trace requests across services
4. **Set log levels** — DEBUG, INFO, WARN, ERROR
5. **Rotate and retain** — don't fill up disk space
6. **Centralize** — all logs in one searchable place`
                },
                {
                  id: 'kadv-m2-l3',
                  title: 'Distributed Tracing',
                  slug: 'distributed-tracing',
                  type: 'TEXT',
                  xpReward: 30,
                  order: 3,
                  content: `# Distributed Tracing

## The Problem

In microservices, a single user request might flow through 10+ services. When something is slow, which service is the bottleneck?

## How Tracing Works

A **trace** follows a request through the entire system. Each service creates a **span** — a unit of work with timing data.

\`\`\`
User Request ────────────────────────────────────▶
  │
  ├── API Gateway (span: 200ms) ──────────────▶
  │     │
  │     ├── Auth Service (span: 30ms) ─────▶
  │     │
  │     ├── Product Service (span: 150ms) ──▶
  │     │     │
  │     │     └── Database (span: 80ms) ──▶
  │     │
  │     └── Cache (span: 5ms) ─────────────▶
\`\`\`

## OpenTelemetry

OpenTelemetry (OTel) is the industry standard for traces, metrics, and logs:

\`\`\`javascript
const { trace } = require('@opentelemetry/api');

const tracer = trace.getTracer('my-service');

async function handleRequest(req, res) {
  const span = tracer.startSpan('handle-request');
  try {
    // Your logic here
    span.setAttribute('user.id', req.userId);
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
    span.setStatus({ code: SpanStatusCode.ERROR });
    span.recordException(error);
  } finally {
    span.end();
  }
}
\`\`\`

## Tools

| Tool | Description |
|------|-------------|
| **Jaeger** | Open-source tracing backend by Uber |
| **Zipkin** | Open-source tracing by Twitter |
| **Tempo** | Grafana's tracing backend |
| **Datadog APM** | Commercial tracing solution |`
                }
              ]
            }
          },
          {
            title: 'Module 3: Advanced Patterns',
            description: 'Auto-scaling, service mesh, GitOps, and security deep dives.',
            order: 3,
            lessons: {
              create: [
                {
                  id: 'kadv-m3-l1',
                  title: 'Auto-scaling',
                  slug: 'auto-scaling',
                  type: 'TEXT',
                  xpReward: 35,
                  order: 1,
                  content: `# Auto-scaling in Kubernetes

## Types of Auto-scaling

| Type | What it scales | Based on |
|------|---------------|----------|
| **HPA** | Pod replicas | CPU, memory, custom metrics |
| **VPA** | Pod resources | Actual usage patterns |
| **Cluster Autoscaler** | Nodes | Pending pods |

## Horizontal Pod Autoscaler (HPA)

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
\`\`\`

\`\`\`bash
# Create HPA imperatively
kubectl autoscale deployment web --cpu-percent=70 --min=2 --max=10

# Check HPA status
kubectl get hpa
\`\`\`

## Scaling Behavior

\`\`\`yaml
behavior:
  scaleUp:
    stabilizationWindowSeconds: 30
    policies:
      - type: Percent
        value: 100
        periodSeconds: 60
  scaleDown:
    stabilizationWindowSeconds: 300
    policies:
      - type: Percent
        value: 10
        periodSeconds: 60
\`\`\`

Scale up aggressively (double in 60s), scale down conservatively (10% per minute with 5-min stabilization).`
                },
                {
                  id: 'kadv-m3-l2',
                  title: 'Service Mesh with Istio',
                  slug: 'service-mesh-istio',
                  type: 'TEXT',
                  xpReward: 35,
                  order: 2,
                  content: `# Service Mesh with Istio

## What is a Service Mesh?

A dedicated infrastructure layer for service-to-service communication. It handles:
- **Traffic management** (routing, load balancing, retries)
- **Security** (mutual TLS, authorization)
- **Observability** (metrics, traces, logs)

## Sidecar Pattern

Istio injects an **Envoy proxy** sidecar into every pod:

\`\`\`
┌─── Pod ──────────────────┐
│  ┌──────────┐  ┌───────┐ │
│  │ Your App │──│ Envoy │ │
│  │          │  │ Proxy │ │
│  └──────────┘  └───┬───┘ │
└────────────────────┼─────┘
                     │
         ┌───────────┼───────────┐
         │     Istio Mesh        │
         └───────────────────────┘
\`\`\`

All traffic flows through the sidecar, giving you full control without changing application code.

## Traffic Management

\`\`\`yaml
# Canary deployment: 90% to v1, 10% to v2
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service
spec:
  hosts:
    - my-service
  http:
    - route:
        - destination:
            host: my-service
            subset: v1
          weight: 90
        - destination:
            host: my-service
            subset: v2
          weight: 10
\`\`\`

## mTLS (Mutual TLS)

Istio automatically encrypts all traffic between services:
\`\`\`yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT
\`\`\``
                },
                {
                  id: 'kadv-m3-l3',
                  title: 'GitOps with ArgoCD',
                  slug: 'gitops-argocd',
                  type: 'TEXT',
                  xpReward: 40,
                  order: 3,
                  content: `# GitOps with ArgoCD

## What is GitOps?

GitOps uses **Git as the single source of truth** for your infrastructure. Instead of running \`kubectl apply\`, you push changes to Git and an operator syncs them.

## Core Principles

1. **Declarative** — Entire system described in Git
2. **Versioned** — Git history = audit trail
3. **Automated** — Changes auto-applied by an agent
4. **Self-healing** — Drift is detected and corrected

## ArgoCD Architecture

\`\`\`
┌─────────┐     ┌──────────┐     ┌────────────┐
│   Git   │────▶│  ArgoCD  │────▶│ Kubernetes │
│  Repo   │     │ (watches) │     │  Cluster   │
└─────────┘     └──────────┘     └────────────┘
                     │
                ┌────┴────┐
                │  ArgoCD │
                │   UI    │
                └─────────┘
\`\`\`

## ArgoCD Application

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/k8s-manifests
    targetRevision: main
    path: apps/my-app
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
\`\`\`

## Workflow

1. Developer pushes code → CI builds image → pushes to registry
2. CI updates image tag in the Git manifests repo
3. ArgoCD detects the change and syncs to the cluster
4. If something goes wrong → \`git revert\` to rollback!

## Benefits

- **Audit trail** — Every change is a git commit
- **Easy rollbacks** — Just revert the commit
- **Security** — No direct cluster access needed for developers
- **Multi-cluster** — Manage many clusters from one ArgoCD instance`
                },
                {
                  id: 'kadv-m3-l4',
                  title: 'Kubernetes Security Deep Dive',
                  slug: 'k8s-security-deep-dive',
                  type: 'TEXT',
                  xpReward: 40,
                  order: 4,
                  content: `# Kubernetes Security Deep Dive

## Security Layers

\`\`\`
┌────────────────────────────┐
│    Supply Chain Security   │  Image scanning, signing
├────────────────────────────┤
│    Cluster Security        │  RBAC, NetworkPolicies
├────────────────────────────┤
│    Pod Security             │  SecurityContext, PSS
├────────────────────────────┤
│    Runtime Security        │  Falco, audit logs
└────────────────────────────┘
\`\`\`

## Pod Security Standards

| Level | Description |
|-------|-------------|
| **Privileged** | No restrictions |
| **Baseline** | Minimal restrictions to prevent known exploits |
| **Restricted** | Heavily restricted, best-practice hardening |

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
\`\`\`

## Network Policies

By default, all pods can talk to all other pods. Lock it down:

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - port: 3000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - port: 5432
\`\`\`

## RBAC Best Practices

1. **Principle of least privilege** — only grant what's needed
2. **Use namespaced Roles** over ClusterRoles when possible
3. **Bind to groups**, not individual users
4. **Audit RBAC** regularly with \`kubectl auth can-i\`

\`\`\`bash
# Check if a user can do something
kubectl auth can-i create deployments --as=dev-user -n staging

# List all permissions for a service account
kubectl auth can-i --list --as=system:serviceaccount:default:my-sa
\`\`\`

## OPA / Gatekeeper

Enforce custom policies:
- No containers running as root
- All images must come from approved registries
- Resource limits must be set
- Labels must include team and environment`
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("  ✅ Kubernetes Advanced created");
  console.log("\n🎉 Seeding complete! Created 4 courses with full curriculum.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
