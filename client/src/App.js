import { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SurveyForm from './components/SurveyForm';
import SearchSurveys from './components/SearchSurveys';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) return (
    <>
      <RegisterForm />
      <LoginForm setToken={setToken} />
    </>
  );

  return (
    <>
      <h1>Survey Dashboard</h1>
      <SurveyForm token={token} />
      <SearchSurveys token={token} />
    </>
  );
}

export default App;
