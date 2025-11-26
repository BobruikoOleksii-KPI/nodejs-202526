const mongoose = require('mongoose');
const Task = require('../models/taskModel');

exports.getAllTasks = async (userId) => Task.find({ userId: new mongoose.Types.ObjectId(userId) });

exports.createTask = async (taskData, userId) => {
  const newTask = new Task({ ...taskData, userId: new mongoose.Types.ObjectId(userId) });
  await newTask.save();
  return newTask;
};

exports.getTaskById = async (id, userId) =>
  Task.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });

exports.updateTask = async (id, updates, userId) =>
  Task.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    },
    updates,
    { new: true }
  );

exports.deleteTask = async (id, userId) =>
  !!Task.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });

exports.getOverdueTasks = async (userId) => {
  const now = new Date();
  return Task.find({
    userId: new mongoose.Types.ObjectId(userId),
    dueDate: { $lt: now },
    status: { $ne: 'completed' },
  });
};
