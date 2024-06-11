import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [language, setLanguage] = useState('cpp');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('input');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const boilerplate = {
    cpp: `#include <iostream> 
using namespace std;
// Define the main function
int main() { 
    // Declare variables
    int num1, num2, sum;
    // Prompt user for input
    cin >> num1 >> num2;  
    // Calculate the sum
    sum = num1 + num2;  
    // Output the result
    cout << "The sum of the two numbers is: " << sum;  
    // Return 0 to indicate successful execution
    return 0;  
}`,
    java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read two integers from input
        int num1 = sc.nextInt();
        int num2 = sc.nextInt();
        // Calculate the sum
        int sum = num1 + num2;
        // Print the sum
        System.out.println("The sum of the two numbers is: " + sum);
    }
}`,
    py: `# Read two integers from input
num1 = int(input())
num2 = int(input())
# Calculate the sum
sum = num1 + num2
# Print the sum
print(f"The sum of the two numbers is: {sum}")
  `
  };

  const [code, setCode] = useState(boilerplate.cpp);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!token) {
        return <div>Loading...</div>;
      }
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
        setInput(data.sampleInputs[0]);
        setProblem(data);
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

    fetchProblem();
    fetchSolvedProblems();
  }, [token, id]);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(boilerplate[selectedLanguage]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8000/problems/submit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ language, code })
      });
      const result = await response.json();
      setSubmissionResult(result);
      setActiveTab('verdict');
      setSubmitting(false);
    } catch (error) {
      setError(error.message);
      setSubmitting(false);
    }
  };

  const handleRun = async (e) => {
    e.preventDefault();
    if (!input) {
      setInput(problem.sampleInputs[0]);
    }
    try {
      const response = await fetch(`http://localhost:8000/problems/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ language, code, input })
      });
      const result = await response.json();
      setOutput(result.output);
      setActiveTab('output');
    } catch (error) {
      setError(error.message);
    }
  };

  const isSolved = (problemId) => solvedProblems.some(problem => problem.problem_id === problemId);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{problem.title} {isSolved(problem.problem_id) && <span style={{ color: 'green' }}> (Solved)</span>}</h2>
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

      <form onSubmit={handleSubmit}>
        <label htmlFor="language">Select language:</label>
        <select
          value={language}
          onChange={handleLanguageChange}
          id="language"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="py">Python</option>
        </select>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code here"
          rows="10"
          cols="50"
        />
        <button type="submit" disabled={submitting}>Submit Code</button>
        <button onClick={handleRun} disabled={submitting}>Run Code</button>
      </form>

      <div>
        <button onClick={() => setActiveTab('input')} className={activeTab === 'input' ? 'active' : ''}>Input</button>
        <button onClick={() => setActiveTab('output')} className={activeTab === 'output' ? 'active' : ''}>Output</button>
        <button onClick={() => setActiveTab('verdict')} className={activeTab === 'verdict' ? 'active' : ''}>Verdict</button>
      </div>

      {activeTab === 'input' && (
        <div>
          <h3>Input</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your input here"
            rows="5"
            cols="50"
          />
        </div>
      )}

      {activeTab === 'output' && (
        <div>
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      )}

      {activeTab === 'verdict' && submissionResult && (
        <div>
          <h3>Verdict</h3>
          <p>{submissionResult.message}</p>
        </div>
      )}
    </div>
  );
};

export default ProblemDetail;
