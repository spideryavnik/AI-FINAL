const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Survey = require('../models/Survey');
const Response = require('../models/Response');

let mongoServer;
let token;
let surveyId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  process.env.REGISTRATION_SECRET = 'testcode';
  process.env.JWT_SECRET = 'testjwt';

  await request(app).post('/auth/register').send({
    username: 'testuser',
    email: 'response@test.com',
    password: 'password123',
    registrationCode: 'testcode'
  });

  const res = await request(app).post('/auth/login').send({
    email: 'response@test.com',
    password: 'password123'
  });

  token = res.body.token;

  // Create a valid survey
  const survey = await Survey.create({
    creator: (await mongoose.connection.collection('users').findOne({}))._id,
    area: 'Community',
    question: 'How to improve public parks?',
    expiryDate: new Date(Date.now() + 100000),
    guidelines: 'Respectful only'
  });

  surveyId = survey._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Response.deleteMany();
});

describe('Responses', () => {
  it('should submit a response to a valid survey', async () => {
    const res = await request(app)
      .post('/responses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        surveyId: surveyId.toString(),
        text: 'Build more benches and shade!'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Build more benches and shade!');
  });

  it('should not submit if response is missing text', async () => {
    const res = await request(app)
      .post('/responses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        surveyId: surveyId.toString()
      });

    expect(res.statusCode).toBe(400);
  });

  it('should not submit to expired survey', async () => {
    const expiredSurvey = await Survey.create({
      creator: (await mongoose.connection.collection('users').findOne({}))._id,
      area: 'Expired',
      question: 'Old question',
      expiryDate: new Date(Date.now() - 10000),
      guidelines: 'None'
    });

    const res = await request(app)
      .post('/responses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        surveyId: expiredSurvey._id.toString(),
        text: 'Too late'
      });

    expect(res.statusCode).toBe(403);
  });
});
