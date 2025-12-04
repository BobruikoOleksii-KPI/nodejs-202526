const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/userModel');
const Task = require('../../src/models/taskModel');
const tasksService = require('../../src/services/tasksService');

describe('Tasks Integration Tests', () => {
  let userId;
  let token;
  let taskId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashed_pass123',
    });
    await testUser.save();
    userId = testUser._id.toString();
    token = `mock_jwt_token_${userId}`;

    const createdTask = await new Task({
      title: 'Test Task',
      dueDate: new Date('2025-12-01'),
      userId: new mongoose.Types.ObjectId(userId),
    }).save();
    taskId = createdTask._id.toString();
  });

  test('POST /api/tasks creates task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', token)
      .send({ title: 'Test Task', dueDate: '2025-12-01' })
      .expect(201);
    expect(res.body.title).toBe('Test Task');
    expect(res.body.userId).toBe(userId);
  });

  test('GET /api/tasks returns all tasks for user', async () => {
    await new Task({ title: 'Task1', userId: new mongoose.Types.ObjectId(userId) }).save();
    const res = await request(app).get('/api/tasks').set('Authorization', token).expect(200);
    expect(res.body.length).toBe(2);
    expect(res.body[1].title).toBe('Task1');
  });

  test('GET /api/tasks/:id returns 404 if task not found', async () => {
    const res = await request(app)
      .get('/api/tasks/invalidid123')
      .set('Authorization', token)
      .expect(404);
    expect(res.body.message).toBe('Task not found or not owned');
  });

  test('PUT /api/tasks/:id returns 404 if task not found', async () => {
    const res = await request(app)
      .put('/api/tasks/invalidid123')
      .set('Authorization', token)
      .send({ status: 'completed' })
      .expect(404);
    expect(res.body.message).toBe('Task not found or not owned');
  });

  test('DELETE /api/tasks/:id returns 404 if task not found', async () => {
    const res = await request(app)
      .delete('/api/tasks/invalidid123')
      .set('Authorization', token)
      .expect(404);
    expect(res.body.message).toBe('Task not found or not owned');
  });

  test('GET /api/tasks/overdue returns 500 on server error', async () => {
    jest.spyOn(Task, 'find').mockRejectedValueOnce(new Error('DB error'));
    await request(app).get('/api/tasks/overdue').set('Authorization', token).expect(500);
  });

  test('GET /api/tasks/overdue returns overdue tasks', async () => {
    await new Task({
      title: 'Overdue',
      dueDate: '2020-01-01',
      status: 'pending',
      userId: new mongoose.Types.ObjectId(userId),
    }).save();
    const res = await request(app)
      .get('/api/tasks/overdue')
      .set('Authorization', token)
      .expect(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe('Test Task');
  });

  test('GET / returns welcome message', async () => {
    const res = await request(app).get('/').expect(200);
    expect(res.text).toBe('Hello from Node.js Task Manager API!');
  });

  // DO NOT UNCOMMENT UNDER ANY CIRCUMSTANCES
  //  test('app handles DB connection error', async () => {
  //  jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error('DB fail'));
  //  const res = await request(app)
  //    .get('/api/tasks')
  //    .set('Authorization', token)
  //    .expect(500);
  //  });

  test('GET /api/tasks/:id returns 500 on server error', async () => {
    jest
      .spyOn(tasksService, 'getTaskById')
      .mockImplementationOnce(() => Promise.reject(new Error('Service error')));
    const res = await request(app)
      .get('/api/tasks/507f1f77bcf86cd799439012')
      .set('Authorization', token)
      .expect(500);
    expect(res.body.error).toBe('Server error');
  });

  test('POST /api/tasks returns 500 on server error', async () => {
    jest.spyOn(tasksService, 'createTask').mockRejectedValueOnce(new Error('Service error'));
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', token)
      .send({ title: 'Test Task', dueDate: '2025-12-01' })
      .expect(500);
    expect(res.body.error).toBe('Server error');
  });

  test('GET /api/tasks/:id returns task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', token)
      .expect(200);
    expect(res.body.title).toBe('Test Task');
  });

  test('GET /api/tasks/:id returns 500 on server error', async () => {
    jest.spyOn(tasksService, 'getTaskById').mockRejectedValueOnce(new Error('Service error'));
    const res = await request(app)
      .get('/api/tasks/validid123')
      .set('Authorization', token)
      .expect(500);
    expect(res.body.error).toBe('Server error');
  });

  test('PUT /api/tasks/:id updates task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', token)
      .send({ status: 'completed' })
      .expect(200);
    expect(res.body.status).toBe('completed');
  });

  // test('PUT /api/tasks/:id returns 500 on server error', async () => {
  //  jest.spyOn(tasksService, 'updateTask').mockRejectedValueOnce(new Error('Service error'));
  //  const res = await request(app)
  //    .put('/api/tasks/507f1f77bcf86cd799439012')
  //    .set('Authorization', token)
  //    .send({ status: 'completed' })
  //    .expect(500);
  //  expect(res.body.error).toBe('Server error');
  // });

  test('DELETE /api/tasks/:id deletes task', async () => {
    await request(app).delete(`/api/tasks/${taskId}`).set('Authorization', token).expect(204);
  });

  test('DELETE /api/tasks/:id returns 500 on server error', async () => {
    jest.spyOn(tasksService, 'deleteTask').mockRejectedValueOnce(new Error('Service error'));
    const res = await request(app)
      .delete('/api/tasks/validid123')
      .set('Authorization', token)
      .expect(500);
    expect(res.body.error).toBe('Server error');
  });
});
