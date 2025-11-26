const tasksService = require('../services/tasksService');

exports.getTasks = (req, res) => {
  const tasks = tasksService.getAllTasks(req.userId);
  res.json(tasks);
  return undefined;
};

exports.createTask = (req, res) => {
  const newTask = tasksService.createTask(req.body, req.userId);
  res.status(201).json(newTask);
  return undefined;
};

exports.getTaskById = (req, res) => {
  const task = tasksService.getTaskById(req.params.id, req.userId);
  if (!task) return res.status(404).json({ message: 'Task not found or not owned' });
  res.json(task);
  return undefined;
};

exports.updateTask = (req, res) => {
  const updatedTask = tasksService.updateTask(req.params.id, req.body, req.userId);
  if (!updatedTask) return res.status(404).json({ message: 'Task not found or not owned' });
  res.json(updatedTask);
  return undefined;
};

exports.deleteTask = (req, res) => {
  const deleted = tasksService.deleteTask(req.params.id, req.userId);
  if (!deleted) return res.status(404).json({ message: 'Task not found or not owned' });
  res.status(204).send();
  return undefined;
};
