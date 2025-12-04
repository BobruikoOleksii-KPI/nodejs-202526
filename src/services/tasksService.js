const mongoose = require('mongoose');
const Task = require('../models/taskModel');

exports.getAllTasks = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  return Task.find({ userId: new mongoose.Types.ObjectId(userId) });
};

exports.createTask = async (taskData, userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  const newTask = new Task({ ...taskData, userId: new mongoose.Types.ObjectId(userId) });
  await newTask.save();
  return newTask;
};

exports.getTaskById = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) return null;
  return Task.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });
};

exports.updateTask = async (id, updates, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) return null;
  return Task.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    },
    updates,
    { new: true }
  );
};

exports.deleteTask = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId))
    return false;
  return !!Task.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });
};

exports.getOverdueTasks = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const now = new Date();
  return Task.find({
    userId: new mongoose.Types.ObjectId(userId),
    dueDate: { $lt: now },
    status: { $ne: 'completed' },
  });
};
