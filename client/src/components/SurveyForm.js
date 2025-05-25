import { useState } from 'react';
import { createSurvey } from '../api';

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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const survey = {
        ...form,
        permittedDomains: form.permittedDomains.split(',').map(s => s.trim()),
        permittedResponses: form.permittedResponses.split(',').map(s => s.trim())
      };
      await createSurvey(survey, token);
      alert('Survey created!');
    } catch (err) {
      alert('Failed to create survey');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Survey</h2>
      <input name="area" value={form.area} onChange={handleChange} placeholder="Area" required />
      <input name="question" value={form.question} onChange={handleChange} placeholder="Question" required />
      <input name="expiryDate" type="datetime-local" value={form.expiryDate} onChange={handleChange} required />
      <input name="guidelines" value={form.guidelines} onChange={handleChange} placeholder="Guidelines" required />
      <input name="permittedDomains" value={form.permittedDomains} onChange={handleChange} placeholder="Permitted Domains (comma-separated)" />
      <input name="permittedResponses" value={form.permittedResponses} onChange={handleChange} placeholder="Permitted Responses (comma-separated)" />
      <input name="summaryInstructions" value={form.summaryInstructions} onChange={handleChange} placeholder="Summary Instructions" />
      <button type="submit">Create</button>
    </form>
  );
}