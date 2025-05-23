const { readFileSync } = require('fs');
const path = require('path');

const validatePrompt = readFileSync(path.join(__dirname, '../prompts/validatePrompt.txt'), 'utf-8');
const summaryPrompt = readFileSync(path.join(__dirname, '../prompts/summaryPrompt.txt'), 'utf-8');
const searchPrompt = readFileSync(path.join(__dirname, '../prompts/searchPrompt.txt'), 'utf-8');

// Mocked LLM validation logic
const validateResponses = async ({ survey, responses }) => {
  return responses
    .filter(r => r.text.toLowerCase().includes("fuck")) // Example of a violation
    .map(r => ({
      surveyId: survey._id.toString(),
      responseId: r._id.toString(),
      reason: "Inappropriate language detected"
    }));
};

// Mocked LLM summary logic
const summarizeSurvey = async ({ survey, responses }) => {
  const responseTexts = responses.map(r => r.text);
  const summary = `Summary for "${survey.question}":\n\n` +
    responseTexts.slice(0, 3).map(text => `- ${text}`).join('\n') +
    `\n\n[Mock summary based on first 3 responses. Replace with real LLM result]`;

  return summary;
};

// Mocked LLM search logic
const searchSurveys = async ({ query, surveys }) => {
  const lowercaseQuery = query.toLowerCase();
  return surveys
    .filter(s =>
      s.area?.toLowerCase().includes(lowercaseQuery) ||
      s.question?.toLowerCase().includes(lowercaseQuery) ||
      s.guidelines?.toLowerCase().includes(lowercaseQuery)
    )
    .map(s => ({
      id: s._id.toString(),
      reason: `Matched query "${query}" in area/question/guidelines`
    }));
};

module.exports = {
  validateResponses,
  summarizeSurvey,
  searchSurveys
};