module.exports = {
  summarizeSurvey: async (survey) => {
    return `Summary for survey: ${survey.question}`;
  },

  validateResponses: async (survey) => {
    return [
      {
        surveyId: survey._id || 'mockSurveyId',
        responseId: 'mockResponseId',
        reason: 'Mocked violation reason',
      }
    ];
  },

  searchSurveys: async ({ query, surveys }) => {
    return surveys.map((s) => ({
      id: s._id?.toString() || 'mockSurveyId',
      reason: `Mocked match for query "${query}"`,
    }));
  }
};
