const Joi = require('joi');
const Survey = require('../models/Survey');
const { searchSurveys } = require('../services/llmService');

const search = async (req, res, next) => {
  const schema = Joi.object({
    query: Joi.string().required()
  });

  let validated;
  try {
    validated = await schema.validateAsync(req.body);
  } catch (validationError) {
    return res.status(400).json({
      error: { code: 400, message: validationError.message }
    });
  }

  try {
    const surveys = await Survey.find();
    const results = await searchSurveys({ query: validated.query, surveys });
    res.json(results);
  } catch (err) {
    next(err);
  }
};

module.exports = { search };
