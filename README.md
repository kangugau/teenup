# TeenUp Management System

A mini web application for managing Students, Parents, Classes, and Subscriptions.

## Tech Stack
- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: React (Vite), Vanilla CSS, Lucide Icons
- **DevOps**: Docker, Docker Compose

## Features
- **User Management**: Create Parents and link Students to them.
- **Class Scheduling**: Create classes with weekly schedules and max capacity.
- **Registration Logic**: 
  - Prevents overbooking (max students).
  - Prevents schedule overlaps for students.
  - Requires active subscription with available sessions.
- **Subscription Tracking**: Initialize packages and track used vs total sessions.
- **Conditional Refunds**: Canceling a registration > 24h before (placeholder logic) refunds a session.

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Running the App
1. Clone the repository.
2. Run the following command in the root directory:
   ```bash
   docker-compose up --build
   ```
3. The UI will be available at `http://localhost`.
4. The API will be available at `http://localhost:3000/api`.
5. (Optional) Seed the database with sample data:
   ```bash
   docker-compose exec api npx prisma db seed
   ```

### Development Setup
If you want to run locally without Docker:
1. Start the database: `docker-compose up db -d`
2. Backend:
   ```bash
   cd api
   pnpm install
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   pnpm start:dev
   ```
3. Frontend:
   ```bash
   cd ui
   pnpm install
   pnpm dev
   ```
