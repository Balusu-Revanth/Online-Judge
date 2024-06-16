import React from "react";
import { Formik, FieldArray, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Box,
  Typography,
  Button,
  MenuItem,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import Navbar from "./Navbar";
const API_URL = process.env.REACT_APP_API_URL;

const AddProblem = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <div>
      <Navbar />
      <Container maxWidth="md" sx={{ paddingTop: "64px" }}>
        <Formik
          initialValues={{
            title: "",
            description: "",
            inputDescription: "",
            outputDescription: "",
            sampleInputs: "",
            sampleOutputs: "",
            difficulty: "",
            tags: [],
            testCases: [{ input: "", output: "" }],
          }}
          validationSchema={Yup.object({
            title: Yup.string().required("Required"),
            description: Yup.string().required("Required"),
            inputDescription: Yup.string().required("Required"),
            outputDescription: Yup.string().required("Required"),
            sampleInputs: Yup.string().required("Required"),
            sampleOutputs: Yup.string().required("Required"),
            difficulty: Yup.string().required("Required"),
            tags: Yup.array()
              .min(1, "Select at least one tag")
              .required("Required"),
            testCases: Yup.array().of(
              Yup.object().shape({
                input: Yup.string().required("Required"),
                output: Yup.string().required("Required"),
              })
            ),
          })}
          onSubmit={async (values) => {
            try {
              const response = await fetch(`${API_URL}/problems/add`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify(values),
              });

              if (!response.ok) {
                throw new Error("Failed to add problem");
              }
              alert("Problem added successfully!");
              navigate("/home");
            } catch (error) {
              console.error("Error:", error);
              alert("Failed to submit problem. Please try again.");
            }
          }}
        >
          {({ values, handleChange }) => (
            <Form>
              <Box mt={3} mb={3}>
                <Typography variant="h4">Add New Problem</Typography>
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  value={values.title}
                  onChange={handleChange}
                  error={!!ErrorMessage.title}
                  helperText={<ErrorMessage name="title" />}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  value={values.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  error={!!ErrorMessage.description}
                  helperText={<ErrorMessage name="description" />}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="inputDescription"
                  name="inputDescription"
                  label="Input Description"
                  value={values.inputDescription}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  error={!!ErrorMessage.inputDescription}
                  helperText={<ErrorMessage name="inputDescription" />}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="outputDescription"
                  name="outputDescription"
                  label="Output Description"
                  value={values.outputDescription}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  error={!!ErrorMessage.outputDescription}
                  helperText={<ErrorMessage name="outputDescription" />}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="sampleInputs"
                  name="sampleInputs"
                  label="Sample Inputs"
                  value={values.sampleInputs}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  error={!!ErrorMessage.sampleInputs}
                  helperText={<ErrorMessage name="sampleInputs" />}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="sampleOutputs"
                  name="sampleOutputs"
                  label="Sample Outputs"
                  value={values.sampleOutputs}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  error={!!ErrorMessage.sampleOutputs}
                  helperText={<ErrorMessage name="sampleOutputs" />}
                />
              </Box>
              <Box mb={2}>
                <FormControl fullWidth error={!!ErrorMessage.difficulty}>
                  <InputLabel id="difficulty-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-label"
                    id="difficulty"
                    name="difficulty"
                    value={values.difficulty}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select difficulty</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                  <ErrorMessage name="difficulty" component="div" />
                </FormControl>
              </Box>
              <Box mb={2}>
                <FormControl fullWidth error={!!ErrorMessage.tags}>
                  <InputLabel id="tags-label">Tags</InputLabel>
                  <Select
                    labelId="tags-label"
                    id="tags"
                    name="tags"
                    multiple
                    value={values.tags}
                    onChange={handleChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="Arrays">Arrays</MenuItem>
                    <MenuItem value="DP">DP</MenuItem>
                    <MenuItem value="Graphs">Graphs</MenuItem>
                    <MenuItem value="Binary Search">Binary Search</MenuItem>
                    {/* More options can be added here */}
                  </Select>
                  <ErrorMessage name="tags" component="div" />
                </FormControl>
              </Box>
              <FieldArray name="testCases">
                {({ remove, push }) => (
                  <div>
                    {values.testCases.map((testCase, index) => (
                      <Box key={index} mb={2}>
                        <Typography variant="h6">
                          Test Case {index + 1}
                        </Typography>
                        <Box mb={1}>
                          <TextField
                            fullWidth
                            id={`testCases.${index}.input`}
                            name={`testCases.${index}.input`}
                            label="Test Case Input"
                            value={testCase.input}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            error={!!ErrorMessage[`testCases.${index}.input`]}
                            helperText={
                              <ErrorMessage name={`testCases.${index}.input`} />
                            }
                          />
                        </Box>
                        <Box mb={1}>
                          <TextField
                            fullWidth
                            id={`testCases.${index}.output`}
                            name={`testCases.${index}.output`}
                            label="Test Case Output"
                            value={testCase.output}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            error={!!ErrorMessage[`testCases.${index}.output`]}
                            helperText={
                              <ErrorMessage
                                name={`testCases.${index}.output`}
                              />
                            }
                          />
                        </Box>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => push({ input: "", output: "" })}
                    >
                      Add Test Case
                    </Button>
                  </div>
                )}
              </FieldArray>
              <Box mt={3}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default AddProblem;
