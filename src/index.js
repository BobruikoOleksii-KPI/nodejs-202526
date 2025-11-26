const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

const tasksRouter = require('./routes/tasks');

app.use('/api/tasks', tasksRouter);

const usersRouter = require('./routes/users');

app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello from Node.js Task Manager API!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
