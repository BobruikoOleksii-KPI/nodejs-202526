const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app'); // Adjust path
const User = require('../../src/models/userModel'); // Adjust path
const usersService = require('../../src/services/usersService'); // Add for mocking

describe('Users Integration Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('POST /api/users/register creates user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'pass123' })
      .expect(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.userId).toBeDefined();
  });

  test('POST /api/users/register returns 400 if missing fields', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: 'test' }) // Missing email/password
      .expect(400);
    expect(res.body.message).toBe('Missing required fields: username, email, password');
  });

  test('POST /api/users/register returns 409 if duplicate email', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'pass123' })
      .expect(201);
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: 'dup', email: 'test@example.com', password: 'pass123' })
      .expect(409);
    expect(res.body.message).toBe('User with this email already exists');
  });

  test('POST /api/users/register returns 500 on server error', async () => {
    jest.spyOn(usersService, 'registerUser').mockRejectedValueOnce(new Error('Service error'));
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'pass123' })
      .expect(500);
    expect(res.body.error).toBe('Server error');
  });

  test('POST /api/users/login logs in user', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'pass123' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'pass123' })
      .expect(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/users/login returns 400 if missing fields', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com' }) // Missing password
      .expect(400);
    expect(res.body.message).toBe('Missing email or password');
  });

  test('POST /api/users/login returns 401 if invalid credentials', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'pass123' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'wrong' })
      .expect(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('POST /api/users/login returns 500 on server error', async () => {
    jest.spyOn(usersService, 'loginUser').mockRejectedValueOnce(new Error('Service error'));
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'pass123' })
      .expect(500);
    expect(res.body.error).toBe('Server error');
  });
});
