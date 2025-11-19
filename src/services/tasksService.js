const taskModel = require('../models/taskModel');

const tasks = taskModel.getMockTasks();

exports.getAllTasks = () => tasks;

exports.createTask = (taskData) => {
  const newTask = {
    id: tasks.length + 1,
    ...taskData,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  return newTask;
};

exports.getTaskById = (id) => tasks.find((t) => t.id === parseInt(id, 10));

exports.updateTask = (id, updates) => {
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id, 10));
  if (taskIndex === -1) return null;
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  return tasks[taskIndex];
};

exports.deleteTask = (id) => {
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id, 10));
  if (taskIndex === -1) return false;
  tasks.splice(taskIndex, 1);
  return true;
};
