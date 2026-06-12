# Database Schema Design

We will use **PostgreSQL** as our primary relational database. 
Below is the proposed schema defined using **Prisma ORM** syntax (`schema.prisma`), which provides a clear, strongly-typed representation of our data models and their relationships.

---

## Prisma Schema

```prisma
// This is your Prisma schema file

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ------------------------------------------------------
// User & Authentication Models
// ------------------------------------------------------

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String?   // Nullable for OAuth users
  name          String?
  role          Role      @default(STUDENT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  profile       Profile?
  progress      Progress[]
  certificates  Certificate[]
}

enum Role {
  STUDENT
  ADMIN
  INSTRUCTOR
}

model Profile {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  xp          Int      @default(0)
  streak      Int      @default(0)
  lastLogin   DateTime @default(now())
  avatarUrl   String?
}

// ------------------------------------------------------
// Educational Content Models
// ------------------------------------------------------

model Course {
  id          String    @id @default(uuid())
  title       String
  slug        String    @unique
  description String
  order       Int       @default(0)
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  modules     Module[]
  certificates Certificate[]
}

model Module {
  id          String    @id @default(uuid())
  courseId    String
  course      Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title       String
  description String?
  order       Int       @default(0)

  lessons     Lesson[]
}

model Lesson {
  id          String    @id @default(uuid())
  moduleId    String
  module      Module    @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  title       String
  slug        String    @unique
  content     String    @db.Text // Markdown content
  type        LessonType @default(TEXT)
  order       Int       @default(0)
  xpReward    Int       @default(10)

  progress    Progress[]
  quiz        Quiz?
  lab         Lab?
}

enum LessonType {
  TEXT
  VIDEO
  QUIZ
  LAB
}

// ------------------------------------------------------
// Interactive Elements (Quizzes & Labs)
// ------------------------------------------------------

model Quiz {
  id          String     @id @default(uuid())
  lessonId    String     @unique
  lesson      Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  passingScore Int       @default(100)

  questions   Question[]
}

model Question {
  id            String   @id @default(uuid())
  quizId        String
  quiz          Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  text          String   @db.Text
  options       Json     // Array of strings or objects representing multiple choice options
  correctAnswer String   // The correct option or index
  explanation   String?  @db.Text
}

model Lab {
  id                String   @id @default(uuid())
  lessonId          String   @unique
  lesson            Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  initialState      Json?    // Simulated terminal initial state
  validationRules   Json     // Rules to determine if the lab is completed
}

// ------------------------------------------------------
// User Progress Tracking
// ------------------------------------------------------

model Progress {
  id          String        @id @default(uuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId    String
  lesson      Lesson        @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  status      ProgressStatus @default(IN_PROGRESS)
  score       Int?          // Relevant for quizzes
  startedAt   DateTime      @default(now())
  completedAt DateTime?

  @@unique([userId, lessonId])
}

enum ProgressStatus {
  IN_PROGRESS
  COMPLETED
}

model Certificate {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  issueDate   DateTime @default(now())
  url         String?

  @@unique([userId, courseId])
}
```
