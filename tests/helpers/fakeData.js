const { faker } = require('@faker-js/faker');

function fakeUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: '123456',
    registrationCode: process.env.REGISTRATION_SECRET || 'testcode',
  };
}

function fakeSurvey() {
  return {
    area: faker.word.words(2),
    question: faker.lorem.sentence(),
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    guidelines: faker.lorem.sentence(),
    permittedDomains: [faker.word.noun(), faker.word.noun()],
    permittedResponses: [faker.lorem.words(2), faker.lorem.words(2)],
    summaryInstructions: faker.lorem.sentence()
  };
}

function fakeResponse(surveyId, userId) {
  return {
    survey: surveyId,
    user: userId,
    text: faker.lorem.paragraph()
  };
}

module.exports = {
  fakeUser,
  fakeSurvey,
  fakeResponse
};