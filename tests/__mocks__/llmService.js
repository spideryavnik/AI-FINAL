module.exports = {
  validateResponses: async () => [
    { surveyId: "survey123", responseId: "response123", reason: "Mocked violation" }
  ],
  summarizeSurvey: async () => "Mocked summary.",
  searchSurveys: async () => [
    { id: "survey123", reason: "Mocked search match" }
  ]
};
