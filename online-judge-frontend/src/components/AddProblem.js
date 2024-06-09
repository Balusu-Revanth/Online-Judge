import React from 'react';
import { Formik, Field, FieldArray, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddProblem = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
        inputDescription: '',
        outputDescription: '',
        sampleInputs: '',
        sampleOutputs: '',
        difficulty: '',
        tags: [],
        testCases: [{ input: '', output: '' }]
      }}
      validationSchema={Yup.object({
        title: Yup.string().required('Required'),
        description: Yup.string().required('Required'),
        inputDescription: Yup.string().required('Required'),
        outputDescription: Yup.string().required('Required'),
        sampleInputs: Yup.string().required('Required'),
        sampleOutputs: Yup.string().required('Required'),
        difficulty: Yup.string().required('Required'),
        tags: Yup.array().min(1, 'Select at least one tag').required('Required'),
        testCases: Yup.array().of(
          Yup.object().shape({
            input: Yup.string().required('Required'),
            output: Yup.string().required('Required')
          })
        )
      })}
      onSubmit={async (values) => {
        try {
          const response = await fetch('http://localhost:8000/problems/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify(values)
          });

          if (!response.ok) {
            throw new Error('Failed to add problem');
          }
          alert('Problem added successfully!');
          navigate('/home');
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to submit problem. Please try again.');
        }
      }}
    >
      {({ values }) => (
        <Form>
          <div>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" />
            <ErrorMessage name="title" component="div" />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <Field id="description" name="description" as="textarea" />
            <ErrorMessage name="description" component="div" />
          </div>
          <div>
            <label htmlFor="inputDescription">Input Description</label>
            <Field id="inputDescription" name="inputDescription" as="textarea" />
            <ErrorMessage name="inputDescription" component="div" />
          </div>
          <div>
            <label htmlFor="outputDescription">Output Description</label>
            <Field id="outputDescription" name="outputDescription" as="textarea" />
            <ErrorMessage name="outputDescription" component="div" />
          </div>
          <div>
            <label htmlFor="sampleInputs">Sample Inputs</label>
            <Field id="sampleInputs" name="sampleInputs" as="textarea" />
            <ErrorMessage name="sampleInputs" component="div" />
          </div>
          <div>
            <label htmlFor="sampleOutputs">Sample Outputs</label>
            <Field id="sampleOutputs" name="sampleOutputs" as="textarea" />
            <ErrorMessage name="sampleOutputs" component="div" />
          </div>
          <div>
            <label htmlFor="difficulty">Difficulty</label>
            <Field id="difficulty" name="difficulty" as="select">
              <option value="">Select difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </Field>
            <ErrorMessage name="difficulty" component="div" />
          </div>
          <div>
            <label htmlFor="tags">Tags</label>
            <Field id="tags" name="tags" as="select" multiple>
              <option value="Arrays">Arrays</option>
              <option value="DP">DP</option>
              <option value="Graphs">Graphs</option>
              <option value="Binary Search">Binary Search</option>
              {/* More options can be added here */}
            </Field>
            <ErrorMessage name="tags" component="div" />
          </div>
          <FieldArray name="testCases">
            {({ remove, push }) => (
              <div>
                {values.testCases.map((testCase, index) => (
                  <div key={index}>
                    <label htmlFor={`testCases.${index}.input`}>Test Case Input</label>
                    <Field id={`testCases.${index}.input`} name={`testCases.${index}.input`} as="textarea" />
                    <ErrorMessage name={`testCases.${index}.input`} component="div" />
                    <label htmlFor={`testCases.${index}.output`}>Test Case Output</label>
                    <Field id={`testCases.${index}.output`} name={`testCases.${index}.output`} as="textarea" />
                    <ErrorMessage name={`testCases.${index}.output`} component="div" />
                    <button type="button" onClick={() => remove(index)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => push({ input: '', output: '' })}>
                  Add Test Case
                </button>
              </div>
            )}
          </FieldArray>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default AddProblem;
