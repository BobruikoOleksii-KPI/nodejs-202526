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

- **User 1 --- \* Task** (One-to-Many): Users own multiple tasks; tasks link back via userId. Ensures data ownership and querying (e.g., get user's tasks).

### ER Diagram

For a visual ER diagram, see [docs/er-diagram.png](docs/er-diagram.png).

This model supports key queries like filtering tasks by user/status, and aggregations (e.g., count overdue tasks).

## Data Operations in Key Scenarios

This section describes how data (Users and Tasks) is updated, changed, or aggregated based on the app's primary use cases

### Key Scenarios and Operations

- **User Registration/Login**:
  - **Creation**: Insert new User with hashed password (future: in usersService.js). Aggregate: Query for unique email/username to prevent duplicates (e.g., find() check)
  - **Change**: Update lastLogin timestamp on successful auth
  - **Aggregation**: Count active users (e.g., filter by recent logins)

- **Create Task**:
  - **Creation**: Insert new Task object into array (tasksService.createTask()). Assign auto-ID, set createdAt, link userId from auth
  - **Change/Aggregation**: No immediate change; aggregate total tasks per user post-creation (e.g., length after push)

- **Read Tasks**:
  - **Query**: Filter tasks by userId/status/priority (tasksService.getAllTasks() with .filter())
  - **Aggregation**: Group by status (e.g., reduce() to count pending/completed) or sort by dueDate

- **Update Task**:
  - **Change**: Modify attributes by ID (tasksService.updateTask()). E.g., patch status to 'completed'—find index, spread updates ({ ...task, ...req.body })
  - **Aggregation**: Recalculate user's completion rate (count completed / total) after update

- **Delete Task**:
  - **Deletion**: Remove by ID (tasksService.deleteTask() with splice()). Soft-delete option: Set deletedAt instead of remove
  - **Aggregation**: Update task counts post-deletion (e.g., re-filter active tasks)

- **Aggregate Overdue Tasks** (Reporting Scenario):
  - **Aggregation**: Filter tasks where dueDate < now() and status != 'completed' (e.g., .filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed'))
  - **Change**: Bulk update overdue to 'delayed' status if needed
  - **Example**: Service method to return summary { overdueCount: n, byPriority: {...} }

## Integration with Remote Data Sources

- Integrated MongoDB Atlas as the remote data source using Mongoose.
- Replaced static in-memory data with async DB operations in models and services.
- Updated controllers for error handling and tested CRUD/overdue endpoints with PowerShell.

- **User Registration**: POST /api/users/register with body { "username": "string", "email": "string", "password": "string" }. Creates user if unique; returns userId (\_id from DB).
- **User Login**: POST /api/users/login with body { "email": "string", "password": "string" }. Returns mock token if valid.
- **Create Task**: POST /api/tasks with body { "title": "string", "description": "string", "dueDate": "YYYY-MM-DD", "priority": "low/medium/high", "status": "pending/in-progress/completed" }. Requires token; assigns userId and persists to DB.
- **Read All Tasks**: GET /api/tasks. Returns user's tasks only (queried from DB by userId).
- **Read Single Task**: GET /api/tasks/:id. Returns if owned; 404 else (queried from DB).
- **Update Task**: PUT /api/tasks/:id with body { "status": "completed" } (or other fields). Updates in DB if owned.
- **Delete Task**: DELETE /api/tasks/:id. Removes from DB if owned.
- **Aggregate Overdue Tasks**: GET /api/tasks/overdue. Returns user's overdue tasks from DB (dueDate < now, status != completed).
  Use Postman, curl, or PowerShell to test. Start server with npm start; ensure MONGODB_URI in .env for connection.

## Mutation Testing Report

- **Tool**: Stryker
- **Mutation Score**: 65.60% (148 killed out of 252 mutants)
- **Effectiveness**: The tests are moderately effective, with strong coverage in controllers (e.g., tasksController.js at 88.30%) and services (tasksService.js at 75.00%), where unit and integration tests killed most mutants in core logic like CRUD operations. However, branches and error handling are weak (0% branch in several files), allowing 47 mutants to survive, mainly in models and routes due to untested edge cases (e.g., invalid IDs, enums). No-cov areas (39) indicate dead code or unexercised paths, and 2 errors suggest test setup issues. Overall, tests detect basic changes but miss subtle bugs in validation and middleware.
- **What to Do Next**: Add more negative tests for errors (e.g., invalid inputs, DB failures) to kill survivors; expand E2E for full flows; remove dead code in models/routes; rerun after fixes to aim for 80%+ score.

### Setup Instructions

1. Clone the repo: `git clone https://github.com/BobruikoOleksii-KPI/nodejs-202526.git`
2. Install dependencies: `npm install`
3. Run the server: `npm start`

### Development Guidelines

- Code style: Airbnb JavaScript Style Guide
- Commit style: Conventional Commits

## License

MIT
