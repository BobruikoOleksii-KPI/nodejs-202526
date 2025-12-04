const mongoose = require('mongoose');
const Task = require('../../src/models/taskModel');
const tasksService = require('../../src/services/tasksService');

jest.mock('../../src/models/taskModel');

describe('tasksService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('getAllTasks: returns tasks for userId', async () => {
    const mockUserId = '507f1f77bcf86cd799439011';
    const mockTasks = [{ _id: '507f1f77bcf86cd799439012', title: 'Task1' }];
    Task.find.mockResolvedValue(mockTasks);
    const result = await tasksService.getAllTasks(mockUserId);
    expect(result).toEqual(mockTasks);
    expect(Task.find).toHaveBeenCalledWith({ userId: expect.any(mongoose.Types.ObjectId) });
  });

  test('createTask: creates and saves new task', async () => {
    const mockTaskData = { title: 'New Task' };
    const mockUserId = '507f1f77bcf86cd799439011';
    const mockInstance = {
      ...mockTaskData,
      userId: new mongoose.Types.ObjectId(mockUserId),
      save: jest.fn(),
    };
    mockInstance.save.mockResolvedValueOnce(mockInstance);
    mockInstance._id = '507f1f77bcf86cd799439012';
    Task.mockImplementation(() => mockInstance);
    const result = await tasksService.createTask(mockTaskData, mockUserId);
    expect(result).toEqual(
      expect.objectContaining({
        _id: '507f1f77bcf86cd799439012',
        title: 'New Task',
        userId: expect.any(mongoose.Types.ObjectId),
      })
    );
    expect(Task).toHaveBeenCalledWith(
      expect.objectContaining({ ...mockTaskData, userId: expect.any(mongoose.Types.ObjectId) })
    );
    expect(mockInstance.save).toHaveBeenCalled();
  });

  test('getTaskById: returns task if found and owned', async () => {
    const mockId = '507f1f77bcf86cd799439012';
    const mockUserId = '507f1f77bcf86cd799439011';
    const mockTask = { _id: mockId, title: 'Task1' };
    Task.findOne.mockResolvedValue(mockTask);
    const result = await tasksService.getTaskById(mockId, mockUserId);
    expect(result).toEqual(mockTask);
    expect(Task.findOne).toHaveBeenCalledWith({
      _id: expect.any(mongoose.Types.ObjectId),
      userId: expect.any(mongoose.Types.ObjectId),
    });
  });

  test('getTaskById: returns null if not found', async () => {
    Task.findOne.mockResolvedValue(null);
    const result = await tasksService.getTaskById(
      '507f1f77bcf86cd799439012',
      '507f1f77bcf86cd799439011'
    );
    expect(result).toBeNull();
  });

  test('updateTask: updates and returns task if owned', async () => {
    const mockId = '507f1f77bcf86cd799439012';
    const mockUserId = '507f1f77bcf86cd799439011';
    const mockUpdates = { title: 'Updated' };
    const mockUpdatedTask = { _id: mockId, title: 'Updated' };
    Task.findOneAndUpdate.mockResolvedValue(mockUpdatedTask);
    const result = await tasksService.updateTask(mockId, mockUpdates, mockUserId);
    expect(result).toEqual(mockUpdatedTask);
    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: expect.any(mongoose.Types.ObjectId), userId: expect.any(mongoose.Types.ObjectId) },
      mockUpdates,
      { new: true }
    );
  });

  test('updateTask: returns null if not found', async () => {
    Task.findOneAndUpdate.mockResolvedValue(null);
    const result = await tasksService.updateTask(
      '507f1f77bcf86cd799439012',
      {},
      '507f1f77bcf86cd799439011'
    );
    expect(result).toBeNull();
  });

  test('deleteTask: deletes and returns true if owned', async () => {
    const mockDeletedTask = { _id: '507f1f77bcf86cd799439012' };
    Task.findOneAndDelete.mockResolvedValue(mockDeletedTask);
    const result = await tasksService.deleteTask(
      '507f1f77bcf86cd799439012',
      '507f1f77bcf86cd799439011'
    );
    expect(result).toBe(true);
    expect(Task.findOneAndDelete).toHaveBeenCalledWith({
      _id: expect.any(mongoose.Types.ObjectId),
      userId: expect.any(mongoose.Types.ObjectId),
    });
  });

  test('deleteTask: returns false if not found', async () => {
    Task.findOneAndDelete.mockResolvedValue(null);
    const result = await tasksService.deleteTask(
      '507f1f77bcf86cd799439012',
      '507f1f77bcf86cd799439011'
    );
    expect(result).toBe(true);
    expect(Task.findOneAndDelete).toHaveBeenCalledWith({
      _id: expect.any(mongoose.Types.ObjectId),
      userId: expect.any(mongoose.Types.ObjectId),
    });
  });

  test('getOverdueTasks: returns overdue tasks for user', async () => {
    const mockUserId = '507f1f77bcf86cd799439011';
    const mockOverdue = [
      { _id: '507f1f77bcf86cd799439012', dueDate: new Date('2020-01-01'), status: 'pending' },
    ];
    Task.find.mockResolvedValue(mockOverdue);
    const result = await tasksService.getOverdueTasks(mockUserId);
    expect(result).toEqual(mockOverdue);
    expect(Task.find).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: expect.any(mongoose.Types.ObjectId),
        dueDate: { $lt: expect.any(Date) },
        status: { $ne: 'completed' },
      })
    );
  });

  test('getOverdueTasks: returns empty array if no overdue', async () => {
    Task.find.mockResolvedValue([]);
    const result = await tasksService.getOverdueTasks('507f1f77bcf86cd799439011');
    expect(result).toEqual([]);
  });
});
