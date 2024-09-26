# In.Orbit API

In.Orbit API is a robust backend solution designed to support the In.Orbit goal management application. Built with Fastify and Node.js, this API allows users to efficiently create, track, and manage their personal goals using PostgreSQL as the database and Drizzle ORM for enhanced query handling.

## Features

- **Goal Creation**: Users can create personal goals with specific frequency targets.
- **Goal Completion**: Mark goals as completed to track progress.
- **Pending Goals Retrieval**: Fetch all pending goals to see what still needs to be achieved.
- **Weekly Summary**: Access a summary of goal progress for the week.

## Tech Stack

- **Backend**: Node.js with Fastify
- **Database**: PostgreSQL using Drizzle ORM

## API Endpoints

### 1. Create a Goal

- **Endpoint**: `POST /goals`
- **Description**: Create a new goal.
- **Request Body**:
  ```json
  {
    "title": "Go to the gym",
    "desiredWeeklyFrequency": 3
  }
  ```

### 2. Complete a Goal

- **Endpoint**: `POST /completions`
- **Description**: Mark a specific goal as completed.
- **Request Body**:
  ```json
  {
    "goalId": "w3c9zs2sxtt8thk68gr9bbrd"
  }
  ```

### 3. Get Pending Goals

- **Endpoint**: `GET /pending-goals`
- **Description**: Retrieve all goals that are still pending.

### 4. Get Weekly Summary

- **Endpoint**: `GET /summary`
- **Description**: Fetch a summary of goals completed in the current week.

## How to Run the API

### 1. Clone the API Repository

```bash
git clone https://github.com/nilloferreiira/InOrbit-API.git
```

### 2. Navigate to the API Project Directory and Install Dependencies

```bash
cd InOrbit-API
npm install
```

### 3. Database Setup

1. Ensure you have Docker installed on your machine.
2. In the API directory, run the following command to start PostgreSQL with Docker:

   ```bash
   docker-compose up -d
   ```

3. Add the database connection URL in the `.env` file. Example:

   ```
   DATABASE_URL=postgres://user:password@localhost:5432/inorbit
   ```

### 4. Migrations

1. Ensure you have **Drizzle Kit** installed:

   ```bash
   npm install drizzle-kit --save-dev
   ```

2. Generate the migrations with Drizzle:

   ```bash
   npx drizzle-kit generate
   ```

3. Run the migrations to create the tables in the database:

   ```bash
   npx drizzle-kit migrate
   ```

### 5. Seed the Database

1. After the migrations, run the following command to seed the database with initial data:

   ```bash
   npm run seed
   ```

### 6. Start the Application

```bash
npm run dev
```

Your API should now be running locally.

## Requirements

- Node.js
- Docker (for PostgreSQL)
- Docker Compose
- PostgreSQL
- Drizzle ORM

## Contact

For more information or questions, please contact me via email: [nilloferreiira@gmail.com](mailto:nilloferreiira@gmail.com)
