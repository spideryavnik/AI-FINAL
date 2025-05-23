const Joi = require('joi');
const Response = require('../models/Response');
const Survey = require('../models/Survey');

const submitResponse = async (req, res, next) => {
  const schema = Joi.object({
    surveyId: Joi.string().required(),
    text: Joi.string().required()
  });

  let validated;
  try {
    validated = await schema.validateAsync(req.body);
  } catch (validationError) {
    return res.status(400).json({
      error: { code: 400, message: validationError.message }
    });
  }

  const { surveyId, text } = validated;

  try {
    const survey = await Survey.findById(surveyId);
    if (!survey) return res.status(404).json({ error: { code: 404, message: 'Survey not found' } });
    if (survey.isClosed || new Date(survey.expiryDate) < new Date()) {
      return res.status(403).json({ error: { code: 403, message: 'Survey is closed or expired' } });
    }

    const response = new Response({
      survey: surveyId,
      user: req.user.userId,
      text
    });

    await response.save();
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = { submitResponse };
