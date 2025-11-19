const tasksService = require('../services/tasksService');

exports.getTasks = (req, res) => {
  const tasks = tasksService.getAllTasks();
  res.json(tasks);
  return undefined;
};

exports.createTask = (req, res) => {
  const newTask = tasksService.createTask(req.body);
  res.status(201).json(newTask);
  return undefined;
};

exports.getTaskById = (req, res) => {
  const task = tasksService.getTaskById(req.params.id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return undefined;
  }
  res.json(task);
  return undefined;
};

exports.updateTask = (req, res) => {
  const updatedTask = tasksService.updateTask(req.params.id, req.body);
  if (!updatedTask) {
    res.status(404).json({ message: 'Task not found' });
    return undefined;
  }
  res.json(updatedTask);
  return undefined;
};

exports.deleteTask = (req, res) => {
  const deleted = tasksService.deleteTask(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Task not found' });
    return undefined;
  }
  res.status(204).send();
  return undefined;
};
