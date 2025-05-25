import { useState } from 'react';
import { searchSurveys } from '../api';

export default function SearchSurveys({ token }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await searchSurveys(query, token);
      setResults(res.data);
    } catch (err) {
      alert('Search failed');
    }
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
          </li>
        ))}
      </ul>
    </>
  );
}