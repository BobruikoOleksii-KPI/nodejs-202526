# Node.js Task Management API

## Project Overview

This is a RESTful API built with Node.js for managing tasks (to-do items), it serves as the backend for a potential task management application, handling user authentication and task CRUD operations

### Key Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Task attributes: title, description, due date, priority, status
- Future extensions: Integration with a database, real-time updates via WebSockets

### Tech Stack

- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Auth**: JWT (jsonwebtoken library)
- **Database**: MongoDB (to be integrated in later labs)
- **Testing**: Jest (for unit/integration tests)
- **Other Tools**: Prettier (formatter), ESLint (linter), Husky (Git hooks)

## Application Structure and Component Interaction

The application is divided into modular components following an MVC-inspired pattern adapted for a Node.js API (Models for data, Controllers for logic, Routes for endpoints, Services for business rules). This promotes separation of concerns, testability, and scalability.

### Main Components/Modules

- **index.js (Entry Point)**: Initializes Express, loads environment variables (dotenv), sets up global middleware, mounts routes, and starts the server
- **routes/**: Defines API endpoints using Express Router (e.g., `tasks.js` for /api/tasks CRUD)
- **controllers/**: Processes requests/responses, validates input, and calls services (e.g., `tasksController.js`)
- **services/**: Contains business logic, data manipulation, and calls models (e.g., `tasksService.js` for task operations)
- **models/**: Defines data schemas and interactions (e.g., `taskModel.js` with mock in-memory data; future: Mongoose for MongoDB)
- **middlewares/**: Custom functions for cross-cutting concerns (e.g., authentication, error handling—placeholders for now)
- **utils/**: Helper utilities (e.g., validators, loggers—optional for expansion)

### Interaction Description (Component Diagram)

For a visual representation, see [docs/component-diagram.png](docs/component-diagram.png).

**Flow Explanation**:

- Incoming requests (e.g., POST /api/tasks) hit **Routes**, which apply **Middlewares** (e.g., auth check)
- Routes delegate to **Controllers**, which extract data from req and call **Services** for processing
- **Services** apply business rules (e.g., validate task dueDate) and interact with **Models** to read/write data
- **Models** handle persistence (currently mocks; later DB queries)
- Responses flow back through controllers to the client
- **Utils** can be called from any module for shared functions
- Interactions are synchronous/async via promises; error handling bubbles up via middleware

This structure allows easy extension (e.g., add user routes) and testing (mock services/models)

Example Flow: A POST /api/tasks request enters via Routes (tasks.js), applies Middlewares (e.g., JSON parsing), reaches Controllers (tasksController.js) to validate and call Services (tasksService.js) for creation logic, which updates Models (taskModel.js mocks). Response returns 201 with new task JSON.

## Data Model and Relationships

The data focuses on users and their tasks, with a simple relational structure. Currently using in-memory mocks in models; planned for MongoDB (NoSQL) or PostgreSQL (SQL) integration.

### Entities and Attributes
- **User**:
  - id (PK, integer)
  - username (string, unique)
  - email (string, unique)
  - password (string, hashed)
  - createdAt (date)

- **Task**:
  - id (PK, integer)
  - title (string, required)
  - description (string)
  - dueDate (date)
  - priority (enum: low/medium/high)
  - status (enum: pending/in-progress/completed)
  - userId (FK, references User.id)
  - category (string)
  - createdAt (date)

### Relationships
- **User 1 --- * Task** (One-to-Many): Users own multiple tasks; tasks link back via userId. Ensures data ownership and querying (e.g., get user's tasks).

### ER Diagram

For a visual ER diagram, see [docs/er-diagram.png](docs/er-diagram.png).

This model supports key queries like filtering tasks by user/status, and aggregations (e.g., count overdue tasks).

### Setup Instructions

1. Clone the repo: `git clone https://github.com/BobruikoOleksii-KPI/nodejs-202526.git`
2. Install dependencies: `npm install`
3. Run the server: `npm start`

### Development Guidelines

- Code style: Airbnb JavaScript Style Guide
- Commit style: Conventional Commits

## License

MIT
