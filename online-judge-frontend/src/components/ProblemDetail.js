import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Navbar from "./Navbar";
import Loading from "./Loading";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-okaidia.css";

const API_URL = process.env.REACT_APP_API_URL;

const Root = styled("div")(({ theme }) => ({
  backgroundColor: "#121212",
  color: "#ffffff",
  minHeight: "104vh",
}));

const CodeEditorContainer = styled("div")(({ theme }) => ({
  fontFamily:
    'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
  fontSize: 14,
  width: "100%",
  padding: "10px",
  border: "1px solid #333",
  borderRadius: "4px",
  backgroundColor: "#1e1e1e",
  color: "#ffffff",
  overflowY: "auto",
}));

const TabContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: "#1e1e1e",
  padding: theme.spacing(2),
  borderRadius: "4px",
  color: "#ffffff",
}));

const ScrollableBox = styled(Paper)(({ theme }) => ({
  maxHeight: "80vh",
  overflowY: "auto",
  padding: theme.spacing(2),
  backgroundColor: "#1e1e1e",
  borderRadius: "4px",
  color: "#ffffff",
}));

const ProblemDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const [problem, setProblem] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("input");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

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
        const response = await fetch(`${API_URL}/problems/${id}`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch problem details");
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
        const response = await fetch(`${API_URL}/user/solved-problems`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch solved problems");
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
      const response = await fetch(`${API_URL}/problems/submit/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ language, code }),
      });
      const result = await response.json();
      setSubmissionResult(result);
      setActiveTab("verdict");
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
      const response = await fetch(`${API_URL}/problems/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ language, code, input }),
      });
      const result = await response.json();
      setOutput(result.message);
      setActiveTab("output");
    } catch (error) {
      setError(error.message);
    }
  };

  const isSolved = (problemId) =>
    solvedProblems.some((problem) => problem.problem_id === problemId);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!problem) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Root>
      <Navbar />
      <Grid container spacing={3} sx={{ paddingTop: "80px" }}>
        <Grid item xs={12} md={6}>
          <ScrollableBox>
            <Typography variant="h4" gutterBottom>
              {problem.title}{" "}
              {isSolved(problem.problem_id) && (
                <CheckCircleIcon style={{ color: "green", marginLeft: 4 }} />
              )}
            </Typography>
            <Box mb={2}>
              <Chip label={problem.difficulty} color="primary" />
              {problem.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  color="secondary"
                  style={{ marginLeft: "5px" }}
                />
              ))}
            </Box>
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="body1" gutterBottom>
                {problem.description}
              </Typography>

              <Box mt={2}>
                <Typography variant="h6">Input Description</Typography>
                <Typography variant="body2" color="text.secondary">
                  {problem.inputDescription}
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="h6">Output Description</Typography>
                <Typography variant="body2" color="text.secondary">
                  {problem.outputDescription}
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="h6">Sample Inputs</Typography>
                <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>
                  {problem.sampleInputs.map((input, index) => (
                    <div key={index}>{input}</div>
                  ))}
                </pre>
              </Box>

              <Box mt={2}>
                <Typography variant="h6">Sample Outputs</Typography>
                <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>
                  {problem.sampleOutputs.map((output, index) => (
                    <div key={index}>{output}</div>
                  ))}
                </pre>
              </Box>
            </Paper>
          </ScrollableBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <ScrollableBox>
            <Box mb={2}>
              <Select
                value={language}
                onChange={handleLanguageChange}
                variant="outlined"
                sx={{
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "#ffffff",
                  },
                }}
              >
                <MenuItem value="cpp">C++</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="py">Python</MenuItem>
              </Select>
            </Box>
            <CodeEditorContainer>
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => highlight(code, languages[language])}
                padding={10}
                style={{
                  fontFamily:
                    'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
                  fontSize: 14,
                  backgroundColor: "#1e1e1e",
                  color: "#ffffff",
                  border: "1px solid #333",
                  borderRadius: "4px",
                }}
              />
            </CodeEditorContainer>
            <Box mt={2}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                textColor="inherit"
              >
                <Tab label="Input" value="input" />
                <Tab label="Output" value="output" />
                <Tab label="Verdict" value="verdict" />
              </Tabs>
              <TabContent>
                {activeTab === "input" && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Input"
                    multiline
                    rows={4}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    sx={{ color: "#ffffff" }}
                    InputProps={{
                      sx: {
                        color: "#ffffff",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ffffff",
                        },
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#ffffff",
                      },
                    }}
                  />
                )}
                {activeTab === "output" && (
                  <Box>
                    <Typography variant="h6">Output</Typography>
                    <pre>{output}</pre>
                  </Box>
                )}
                {activeTab === "verdict" && (
                  <Box>
                    <Typography variant="h6">Verdict</Typography>
                    <pre
                      style={{
                        color: submissionResult?.message === "All test cases passed"
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      }}
                    >
                      {submissionResult?.message}
                    </pre>
                  </Box>
                )}
              </TabContent>
            </Box>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleRun}
                disabled={submitting}
              >
                Run Code
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                Submit
              </Button>
            </Box>
            {submitting && (
              <Box mt={2}>
                <CircularProgress />
              </Box>
            )}
          </ScrollableBox>
        </Grid>
      </Grid>
    </Root>
  );
};

export default ProblemDetail;
