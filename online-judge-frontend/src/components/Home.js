import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { admin, token } = useAuth();

  useEffect(() => {
    const fetchProblems = async () => {
      if (!token) {
        return <div>Loading...</div>;
      }
      try {
        const response = await fetch('http://localhost:8000/problems/all', {
          method: 'GET',
          headers: {
            'Authorization': token
          }
        });
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
  }, [token]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProblemClick = (id) => {
    navigate(`/problems/${id}`);
  };

  return (
    <div>
      <h2>Welcome to Home Page</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={() => navigate('/account')}>Account Settings</button>
      {admin && <button onClick={() => navigate('/add-problem')}>Add Problem</button>}
      <h3>Problem List</h3>
      <ul>
        {problems.map(problem => (
          <li key={problem.problem_id} onClick={() => handleProblemClick(problem.problem_id)}>
            <h4>{problem.title}</h4>
            <p><strong>Difficulty:</strong> {problem.difficulty}</p>
            <p><strong>Tags:</strong> {problem.tags.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
