const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  process.env.REGISTRATION_SECRET = 'testcode';
  process.env.JWT_SECRET = 'testjwt';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe('Authentication', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        registrationCode: 'testcode'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Registration successful');
  });

  it('should reject registration with wrong registration code', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        registrationCode: 'wrongcode'
      });

    expect(res.statusCode).toBe(403);
  });

  it('should login a registered user', async () => {
    // Register first
    await request(app).post('/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      registrationCode: 'testcode'
    });

    // Login
    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    // Register first
    await request(app).post('/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      registrationCode: 'testcode'
    });

    // Login with wrong password
    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpass'
    });

    expect(res.statusCode).toBe(401);
  });
});
