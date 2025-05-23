const Joi = require('joi');
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const { validateResponses, summarizeSurvey } = require('../services/llmService');

// Create a new survey
const createSurvey = async (req, res, next) => {
  try {
    const schema = Joi.object({
      area: Joi.string().required(),
      question: Joi.string().required(),
      expiryDate: Joi.date().required(),
      guidelines: Joi.string().required(),
      permittedDomains: Joi.array().items(Joi.string()),
      permittedResponses: Joi.array().items(Joi.string()),
      summaryInstructions: Joi.string()
    });

    const data = await schema.validateAsync(req.body);

    const survey = new Survey({
      ...data,
      creator: req.user.userId
    });

    await survey.save();
    res.status(201).json(survey);
  } catch (err) {
    next(err);
  }
};

// Validate responses in a survey using AI
const checkResponses = async (req, res, next) => {
  try {
    const surveyId = req.params.id;
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ error: { code: 404, message: 'Survey not found' } });
    }

    if (survey.creator.toString() !== req.user.userId) {
      return res.status(403).json({ error: { code: 403, message: 'Only the creator can validate responses' } });
    }

    const responses = await Response.find({ survey: surveyId });
    const violations = await validateResponses({ survey, responses });

    res.json(violations);
  } catch (err) {
    next(err);
  }
};

// Generate summary using AI for a survey's responses
const generateSummary = async (req, res, next) => {
  try {
    const surveyId = req.params.id;
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ error: { code: 404, message: 'Survey not found' } });
    }

    if (survey.creator.toString() !== req.user.userId) {
      return res.status(403).json({ error: { code: 403, message: 'Only the creator can generate summary' } });
    }

    const responses = await Response.find({ survey: surveyId });
    const summary = await summarizeSurvey({ survey, responses });

    survey.summary = summary;
    await survey.save();

    res.json({ summary });
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  createSurvey,
  checkResponses,
  generateSummary
};
