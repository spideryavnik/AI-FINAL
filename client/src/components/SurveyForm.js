import { useState } from 'react';
import { createSurvey } from '../api';
import axios from 'axios';

export default function SurveyForm({ token }) {
  const [form, setForm] = useState({
    area: '',
    question: '',
    expiryDate: '',
    guidelines: '',
    permittedDomains: '',
    permittedResponses: '',
    summaryInstructions: ''
  });
  const [summary, setSummary] = useState('');
  const [surveyId, setSurveyId] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Convert expiryDate to ISO string (with seconds and Z for UTC)
      const expiryDateISO = new Date(form.expiryDate).toISOString();
      const survey = {
        ...form,
        expiryDate: expiryDateISO,
        permittedDomains: form.permittedDomains.split(',').map(s => s.trim()),
        permittedResponses: form.permittedResponses.split(',').map(s => s.trim())
      };
      const res = await createSurvey(survey, token);
      alert('Survey created!');
      setSurveyId(res.data._id); // Save the created survey ID
    } catch (err) {
      alert('Failed to create survey');
    }
  };

  const handleSummary = async () => {
    if (!surveyId) {
      alert('Please create a survey first.');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:3000/surveys/${surveyId}/summary`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(res.data.summary);
    } catch (err) {
      alert('Failed to generate summary');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Create Survey</h2>
        <input name="area" value={form.area} onChange={handleChange} placeholder="Area *" required />
        <input name="question" value={form.question} onChange={handleChange} placeholder="Question *" required />
        <input name="expiryDate" type="datetime-local" value={form.expiryDate} onChange={handleChange} required />
        <input name="guidelines" value={form.guidelines} onChange={handleChange} placeholder="Guidelines *" required />
        <input name="permittedDomains" value={form.permittedDomains} onChange={handleChange} placeholder="Permitted Domains (comma-separated)" />
        <input name="permittedResponses" value={form.permittedResponses} onChange={handleChange} placeholder="Permitted Responses (comma-separated)" />
        <input name="summaryInstructions" value={form.summaryInstructions} onChange={handleChange} placeholder="Summary Instructions" />
        <button type="submit">Create</button>
      </form>
      {surveyId && (
        <button onClick={handleSummary} style={{ marginTop: 16 }}>Generate AI Summary</button>
      )}
      {summary && (
        <div style={{ marginTop: 16 }}>
          <h3>AI Summary:</h3>
          <pre>{summary}</pre>
        </div>
      )}
    </>
  );
}