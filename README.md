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

### Architecture
- Modular structure: Separate folders for routes, controllers, models, services
- Error handling and validation using middleware

### Setup Instructions
1. Clone the repo: `git clone https://github.com/BobruikoOleksii-KPI/nodejs-202526.git`
2. Install dependencies: `npm install`
3. Run the server: `npm start`

### Development Guidelines
- Code style: Airbnb JavaScript Style Guide
- Commit style: Conventional Commits

## License
MIT