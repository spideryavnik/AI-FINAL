const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Survey = require('../models/Survey');

// Mock the LLM search
jest.mock('../services/llmService', () => ({
  validateResponses: jest.fn(() => []),
  summarizeSurvey: jest.fn(() => 'Mocked summary'),
  searchSurveys: jest.fn(({ query, surveys }) => [
    {
      id: surveys[0]._id.toString(),
      reason: `Mocked reason for query "${query}"`
    }
  ])
}));

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  process.env.REGISTRATION_SECRET = 'testcode';
  process.env.JWT_SECRET = 'testjwt';

  await request(app).post('/auth/register').send({
    username: 'searchuser',
    email: 'search@test.com',
    password: 'password123',
    registrationCode: 'testcode'
  });

  const res = await request(app).post('/auth/login').send({
    email: 'search@test.com',
    password: 'password123'
  });

  token = res.body.token;

  await Survey.create({
    creator: (await mongoose.connection.collection('users').findOne({}))._id,
    area: 'Food',
    question: 'How can we improve the cafeteria?',
    expiryDate: new Date(Date.now() + 100000),
    guidelines: 'Be polite'
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Search Surveys', () => {
  it('should return matching surveys based on query', async () => {
    const res = await request(app)
      .post('/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: 'food' });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('reason');
  });

  it('should return 400 if query is missing', async () => {
    const res = await request(app)
      .post('/search')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });
});
