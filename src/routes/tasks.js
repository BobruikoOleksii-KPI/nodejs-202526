const express = require('express');
const authMiddleware = require('../middlewares/auth');
const tasksController = require('../controllers/tasksController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', tasksController.getTasks);

router.post('/', tasksController.createTask);

router.get('/:id', tasksController.getTaskById);

router.put('/:id', tasksController.updateTask);

router.delete('/:id', tasksController.deleteTask);

router.get('/overdue', tasksController.getOverdueTasks);

module.exports = router;
