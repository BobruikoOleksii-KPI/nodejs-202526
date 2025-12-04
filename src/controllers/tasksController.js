const tasksService = require('../services/tasksService');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await tasksService.getAllTasks(req.userId);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = await tasksService.createTask(req.body, req.userId);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await tasksService.getTaskById(req.params.id, req.userId);
    if (!task) {
      res.status(404).json({ message: 'Task not found or not owned' });
      return;
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await tasksService.updateTask(req.params.id, req.body, req.userId);
    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found or not owned' });
      return;
    }
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await tasksService.deleteTask(req.params.id, req.userId);
    if (!deleted) {
      res.status(404).json({ message: 'Task not found or not owned' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOverdueTasks = async (req, res) => {
  try {
    const overdue = await tasksService.getOverdueTasks(req.userId);
    res.json(overdue);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
