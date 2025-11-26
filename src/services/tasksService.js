const Task = require('../models/taskModel');

exports.getAllTasks = async (userId) => Task.find({ userId });

exports.createTask = async (taskData, userId) => {
  const newTask = new Task({ ...taskData, userId });
  await newTask.save();
  return newTask;
};

exports.getTaskById = async (id, userId) => Task.findOne({ _id: id, userId });

exports.updateTask = async (id, updates, userId) => {
  // eslint-disable-next-line no-unused-expressions
  id;
  return Task.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
};

exports.deleteTask = async (id, userId) => !!Task.findOneAndDelete({ _id: id, userId });

exports.getOverdueTasks = async (userId) => {
  const now = new Date();
  return Task.find({
    userId,
    dueDate: { $lt: now },
    status: { $ne: 'completed' },
  });
};
