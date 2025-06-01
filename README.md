# SLP

A simple Sanskrit learning platform API built with Node.js, Express, Prisma, and SQLite.

## Features

- User registration and login (with password hashing)
- Lesson and exercise management
- User progress tracking (XP, streaks, completed lessons)
- Exercise attempts and XP awards
- Weekly leaderboard

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/NikhilCodes04/slp-backend.git
cd slp-backend
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up the Database

- The project uses SQLite and Prisma ORM.
- The default database file is `dev.db` in the project root.

#### Run Prisma Migrations

```sh
npm run prisma-migrate
```

#### Generate Prisma Client

```sh
npm run prisma-generate
```

#### (Optional) Open Prisma Studio

```sh
npm run prisma-studio
```

### 4. Environment Variables

 Create a `.env` file with:
  ```
  DATABASE_URL="file:./dev.db"
  ```

### 5. Start the Development Server

```sh
npm run dev
```

The server will start on `http://localhost:3000`.

## API Endpoints

### User

- `POST /user/register`  Register a new user
- `POST /user/login` Login
- `GET /user/profile` Get user profile (requires `userId` in body)

### Lessons & Exercises

- `POST /api/lessons` Create a lesson
- `GET /api/lessons`  List all lessons
- `POST /api/exercises`  Create an exercise
- `GET /api/lessons/:lessonId/exercises`  List exercises for a lesson

### Progress

- `POST /progress/complete-lesson`  Mark lesson as completed
- `GET /progress/completed-lessons/:userId`  Get completed lessons for user
- `POST /progress/exercise-attempt`  Record an exercise attempt
- `GET /progress/exercise-attempts/:userId`  Get all attempts for user
- `GET /progress/leaderboard/weekly`  Weekly leaderboard by XP

## Project Structure

```
src/
  app.js
  controllers/
    lessonController.js
    progressController.js
    userController.js
  models/
    schema.prisma
    migrations/
  routes/
    lessonRoutes.js
    progressRoutes.js
    userRoutes.js
.env
package.json
dev.db
```

## Notes

- Passwords are hashed using bcryptjs.
- Authentication is mocked (no JWT/session).
- All data is stored in a local SQLite database (`dev.db`).

---

