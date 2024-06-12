import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loading from './Loading';

const useStyles = makeStyles((theme) => ({
  codeEditor: {
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
    fontSize: 14,
    width: '100%',
    minHeight: '400px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
  },
  tabContent: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const ProblemDetail = () => {
  const classes = useStyles();
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

int main() { 
    int num1, num2, sum;
    cin >> num1 >> num2;  
    sum = num1 + num2;  
    cout << "The sum of the two numbers is: " << sum;  
    return 0;  
}`,
    java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int num1 = sc.nextInt();
        int num2 = sc.nextInt();
        int sum = num1 + num2;
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
`,
  };

  const [code, setCode] = useState(boilerplate.cpp);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!token) {
        return <Loading />;
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
      setOutput(result.message);
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" gutterBottom>
          {problem.title} {isSolved(problem.problem_id) && <span style={{ color: 'green' }}> (Solved)</span>}
        </Typography>
        <Box mb={2}>
          <Chip label={problem.difficulty} color="primary" />
          {problem.tags.map((tag, index) => (
            <Chip key={index} label={tag} color="secondary" style={{ marginLeft: '5px' }} />
          ))}
        </Box>
        <Typography variant="body1">{problem.description}</Typography>
        <Typography variant="h6">Input Description</Typography>
        <Typography variant="body2">{problem.inputDescription}</Typography>
        <Typography variant="h6">Output Description</Typography>
        <Typography variant="body2">{problem.outputDescription}</Typography>
        <Typography variant="h6">Sample Inputs</Typography>
        <pre>{problem.sampleInputs.join('\n')}</pre>
        <Typography variant="h6">Sample Outputs</Typography>
        <pre>{problem.sampleOutputs.join('\n')}</pre>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box mb={2}>
          <Typography variant="h6">Code Editor</Typography>
          <Select
            value={language}
            onChange={handleLanguageChange}
            variant="outlined"
            className={classes.formControl}
          >
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="py">Python</MenuItem>
          </Select>
        </Box>
        <TextField
          multiline
          rows={15}
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={classes.codeEditor}
        />
        <Box mt={2}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Input" value="input" />
            <Tab label="Output" value="output" />
            <Tab label="Verdict" value="verdict" />
          </Tabs>
          <Box className={classes.tabContent}>
            {activeTab === 'input' && (
              <TextField
                multiline
                rows={5}
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
              />
            )}
            {activeTab === 'output' && (
              <Typography variant="body1"><pre>{output}</pre></Typography>
            )}
            {activeTab === 'verdict' && submissionResult && (
              <Typography variant="body1">{submissionResult.message}</Typography>
            )}
          </Box>
          <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRun}
            disabled={submitting}
            style={{ marginRight: '10px' }}
          >
            Run Code
          </Button>
          <Button
           variant="contained"
           color="primary"
           onClick={handleSubmit}
           disabled={submitting}
          >
            Submit Code
          </Button>
        </Box>
      </Box>
    </Grid>
  </Grid>
  );
};

export default ProblemDetail;
