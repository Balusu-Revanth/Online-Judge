import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('http://localhost:8000/problems/all');
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProblems();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Welcome to Home Page</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={() => navigate('/account')}>Account Settings</button>
      <h3>Problem List</h3>
      <ul>
        {problems.map(problem => (
          <li key={problem._id}>
            <h4>{problem.title}</h4>
            <p>{problem.description}</p>
            <p><strong>Difficulty:</strong> {problem.difficulty}</p>
            <p><strong>Tags:</strong> {problem.tags.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
