const express = require('express');
const authMiddleware = require('../middlewares/auth');
const tasksController = require('../controllers/tasksController');

const router = express.Router();

router.use(authMiddleware); // Apply auth to all task routes

router.get('/', tasksController.getTasks);

router.post('/', tasksController.createTask);

router.get('/overdue', tasksController.getOverdueTasks);

router.get('/:id', tasksController.getTaskById);

router.put('/:id', tasksController.updateTask);

router.delete('/:id', tasksController.deleteTask);

module.exports = router;
