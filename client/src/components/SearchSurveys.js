import { useState } from 'react';
import axios from 'axios';
import { searchSurveys, submitResponse } from '../api';

export default function SearchSurveys({ token }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [respondingId, setRespondingId] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await searchSurveys(query, token);
      setResults(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  const handleSummary = async id => {
    setLoadingId(id);
    setSummary('');
    try {
      const res = await axios.post(
        `http://localhost:3000/surveys/${id}/summary`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(res.data.summary);
    } catch (err) {
      alert('Failed to generate summary');
    }
    setLoadingId(null);
  };

  const handleResponse = async id => {
    if (!responseText.trim()) {
      alert('Please enter a response.');
      return;
    }
    setRespondingId(id);
    try {
      await submitResponse(id, responseText, token);
      alert('Response submitted!');
      setResponseText('');
    } catch (err) {
      const msg = err?.response?.data?.error?.message || 'Failed to submit response';
      alert(msg);
    }
    setRespondingId(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Search Surveys</h2>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." required />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            <strong>ID:</strong> {r.id} <br />
            <strong>Reason:</strong> {r.reason}
            <br />
            <button onClick={() => handleSummary(r.id)} disabled={loadingId === r.id}>
              {loadingId === r.id ? 'Generating Summary...' : 'Generate AI Summary'}
            </button>
            <button
              onClick={async () => {
                setLoadingId('summary-' + r.id);
                setSummary('');
                try {
                  const res = await axios.post(
                    `http://localhost:3000/surveys/${r.id}/summary`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  setSummary(res.data.summary);
                } catch (err) {
                  alert('Failed to generate summary');
                }
                setLoadingId(null);
              }}
              style={{ marginLeft: 8 }}
            >
              Show All Responses AI Summary
            </button>
            <div style={{ marginTop: 8 }}>
              <input
                type="text"
                placeholder="Your response..."
                value={respondingId === r.id ? responseText : ''}
                onChange={e => {
                  setRespondingId(r.id);
                  setResponseText(e.target.value);
                }}
                style={{ width: '60%' }}
              />
              <button
                onClick={() => handleResponse(r.id)}
                disabled={respondingId === r.id && !responseText.trim()}
                style={{ marginLeft: 8 }}
              >
                Submit Response
              </button>
            </div>
          </li>
        ))}
      </ul>
      {summary && (
        <div style={{ marginTop: 16 }}>
          <h3>AI Summary:</h3>
          <pre>{summary}</pre>
        </div>
      )}
    </>
  );
}