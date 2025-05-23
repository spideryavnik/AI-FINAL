const {
  summarizeSurvey,
  searchSurveys,
  validateResponses
} = require('../services/llmService');

describe('LLM Service', () => {
  describe('summarizeSurvey', () => {
    it('should return summary with first 3 responses', async () => {
      const result = await summarizeSurvey({
        survey: { question: "What's your opinion?" },
        responses: [
          { text: "First response" },
          { text: "Second response" },
          { text: "Third response" },
          { text: "Fourth response" },
        ],
      });

      expect(result).toContain("First response");
      expect(result).toContain("Second response");
      expect(result).toContain("Third response");
      expect(result).not.toContain("Fourth response");
    });
  });

  describe('searchSurveys', () => {
    it('should return surveys that match query', async () => {
      const surveys = [
        { _id: 1, area: "Health", question: "Q1", guidelines: "Some guidelines" },
        { _id: 2, area: "Education", question: "Q2", guidelines: "More guidelines" },
      ];
      const result = await searchSurveys({ query: "health", surveys });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe("1");
    });
  });

  describe('validateResponses', () => {
    it('should flag inappropriate language', async () => {
      const responses = [
        { _id: "a", text: "this is fine" },
        { _id: "b", text: "fuck this" },
      ];
      const survey = { _id: "s1" };

      const result = await validateResponses({ survey, responses });
      expect(result).toEqual([
        {
          surveyId: "s1",
          responseId: "b",
          reason: "Inappropriate language detected"
        }
      ]);
    });
  });
});
