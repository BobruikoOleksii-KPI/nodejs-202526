const express = require('express');
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/overdue', tasksController.getOverdueTasks);

router.get('/', tasksController.getTasks);

router.post('/', tasksController.createTask);

router.get('/:id', tasksController.getTaskById);

router.patch('/:id', tasksController.updateTask);

router.delete('/:id', tasksController.deleteTask);

module.exports = router;
