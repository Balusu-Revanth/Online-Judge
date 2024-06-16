import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Container,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Navbar from "./Navbar";
import Loading from "./Loading";
const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { admin, token } = useAuth();

  useEffect(() => {
    const fetchProblems = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/problems/all`, {
          method: "GET",
          headers: { Authorization: token },
        });
        if (!response.ok) throw new Error("Failed to fetch problems");
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchSolvedProblems = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/user/solved-problems`, {
          method: "GET",
          headers: { Authorization: token },
        });
        if (!response.ok) throw new Error("Failed to fetch solved problems");
        const data = await response.json();
        setSolvedProblems(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchData = async () => {
      await fetchProblems();
      await fetchSolvedProblems();
      setLoading(false);
    };

    fetchData();
  }, [token]);

  const handleProblemClick = (id) => {
    navigate(`/problems/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this problem?"
    );
    if (!confirmDelete || !token) return;
    try {
      const response = await fetch(`${API_URL}/problems/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error("Failed to delete problem");
      setProblems(problems.filter((problem) => problem.problem_id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  const isSolved = (problemId) =>
    solvedProblems.some((problem) => problem.problem_id === problemId);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      {error && <Typography color="error">{error}</Typography>}
      <Container sx={{ paddingTop: "64px" }}>
        <Box mt={2}>
          <Typography variant="h4">Problem List</Typography>
          <List>
            {problems.map((problem) => (
              <ListItem
                key={problem.problem_id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: "grey.900",
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Box
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    paddingBottom: 1,
                    color: "white",
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                  onClick={() => handleProblemClick(problem.problem_id)}
                >
                  <Typography variant="h6">{problem.title}</Typography>
                  {isSolved(problem.problem_id) && (
                    <CheckCircleIcon
                      style={{ color: "green", marginLeft: 4 }}
                    />
                  )}
                </Box>
                <ListItemText
                  primary={
                    <>
                      <Chip
                        label={problem.difficulty}
                        color={getDifficultyColor(problem.difficulty)}
                        size="small"
                        sx={{ marginBottom: 1, color: "white" }}
                      />
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {problem.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            color="secondary"
                            size="small"
                            sx={{ color: "white" }}
                          />
                        ))}
                      </Box>
                    </>
                  }
                />
                {admin && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(problem.problem_id);
                      }}
                      sx={{
                        color: "white",
                        "&:hover": {
                          color: "red",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
