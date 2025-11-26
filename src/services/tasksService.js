const taskModel = require('../models/taskModel');

const tasks = taskModel.getMockTasks();

exports.getAllTasks = (userId) => {
  const userTasks = tasks.filter((t) => t.userId === userId);
  return userTasks;
};

exports.createTask = (taskData, userId) => {
  const newTask = {
    id: tasks.length + 1,
    ...taskData,
    userId,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  return newTask;
};

exports.getTaskById = (id, userId) => {
  const task = tasks.find((t) => t.id === parseInt(id, 10) && t.userId === userId);
  return task;
};

exports.updateTask = (id, updates, userId) => {
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id, 10) && t.userId === userId);
  if (taskIndex === -1) return null;
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  return tasks[taskIndex];
};

exports.deleteTask = (id, userId) => {
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id, 10) && t.userId === userId);
  if (taskIndex === -1) return false;
  tasks.splice(taskIndex, 1);
  return true;
};
