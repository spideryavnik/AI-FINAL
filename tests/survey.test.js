const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Survey = require('../models/Survey');
const Response = require('../models/Response');

// Mock the LLM service
jest.mock('../services/llmService', () => ({
  validateResponses: jest.fn(() => [
    { surveyId: 'mockSurveyId', responseId: 'mockResponseId', reason: 'Mock reason' }
  ]),
  summarizeSurvey: jest.fn(() => 'Mocked summary'),
  searchSurveys: jest.fn(() => [])
}));

let mongoServer;
let token;
let createdSurveyId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  process.env.REGISTRATION_SECRET = 'testcode';
  process.env.JWT_SECRET = 'testjwt';

  // Register and login user
  await request(app).post('/auth/register').send({
    username: 'testuser',
    email: 'user@test.com',
    password: 'password123',
    registrationCode: 'testcode'
  });

  const res = await request(app).post('/auth/login').send({
    email: 'user@test.com',
    password: 'password123'
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Survey.deleteMany();
  await Response.deleteMany();
});

describe('Surveys', () => {
  it('should create a survey', async () => {
    const res = await request(app)
      .post('/surveys')
      .set('Authorization', `Bearer ${token}`)
      .send({
        area: 'Education',
        question: 'How can we improve schools?',
        expiryDate: '2025-12-31',
        guidelines: 'Be nice.',
        permittedDomains: ['teaching'],
        permittedResponses: ['polite'],
        summaryInstructions: 'Make it kid-friendly'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();
    createdSurveyId = res.body._id;
  });

  it('should generate AI summary for a survey', async () => {
    const survey = await Survey.create({
      creator: (await mongoose.connection.collection('users').findOne({}))._id,
      area: 'Health',
      question: 'How to stay fit?',
      expiryDate: new Date(Date.now() + 100000),
      guidelines: 'Be honest',
      summaryInstructions: 'Keep it short'
    });

    const res = await request(app)
      .post(`/surveys/${survey._id}/summary`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.summary).toBe('Mocked summary');
  });

  it('should validate responses for a survey using AI', async () => {
    const survey = await Survey.create({
      creator: (await mongoose.connection.collection('users').findOne({}))._id,
      area: 'Tech',
      question: 'How to improve AI?',
      expiryDate: new Date(Date.now() + 100000),
      guidelines: 'Clear language'
    });

    const response = await Response.create({
      survey: survey._id,
      user: survey.creator,
      text: 'Some answer'
    });

    const res = await request(app)
      .get(`/surveys/${survey._id}/check-responses`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
