import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`http://localhost:8000/problems/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': token
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch problem details');
        }
        const data = await response.json();
        setProblem(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProblem();
  }, [token, id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{problem.title}</h2>
      <p>{problem.description}</p>
      <h3>Input Description</h3>
      <p>{problem.inputDescription}</p>
      <h3>Output Description</h3>
      <p>{problem.outputDescription}</p>
      <h3>Sample Inputs</h3>
      <pre>{problem.sampleInputs}</pre>
      <h3>Sample Outputs</h3>
      <pre>{problem.sampleOutputs}</pre>
      <p><strong>Difficulty:</strong> {problem.difficulty}</p>
      <p><strong>Tags:</strong> {problem.tags.join(', ')}</p>
    </div>
  );
};

export default ProblemDetail;
