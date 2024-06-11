import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { admin, token } = useAuth();

  useEffect(() => {
    const fetchProblems = async () => {
      if (!token) {
        return;
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

    const fetchSolvedProblems = async () => {
      if (!token) {
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/user/solved-problems', {
          method: 'GET',
          headers: {
            'Authorization': token
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch solved problems');
        }
        const data = await response.json();
        setSolvedProblems(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProblems();
    fetchSolvedProblems();
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

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this problem?');
    if (!confirmDelete || !token) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/problems/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete problem');
      }
      setProblems(problems.filter(problem => problem.problem_id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const isSolved = (problemId) => solvedProblems.some(problem => problem.problem_id === problemId);

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
          <li key={problem.problem_id}>
            <div onClick={() => handleProblemClick(problem.problem_id)}>
              <h4>{problem.title} {isSolved(problem.problem_id) && <span style={{ color: 'green' }}> (Solved)</span>}</h4>
              <p><strong>Difficulty:</strong> {problem.difficulty}</p>
              <p><strong>Tags:</strong> {problem.tags.join(', ')}</p>
            </div>
            {admin && <button onClick={() => handleDeleteClick(problem.problem_id)}>Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
