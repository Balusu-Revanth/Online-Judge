import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddProblem = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      inputDescription: '',
      outputDescription: '',
      sampleInputs: '',
      sampleOutputs: '',
      difficulty: '',
      tags: []
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      inputDescription: Yup.string().required('Required'),
      outputDescription: Yup.string().required('Required'),
      sampleInputs: Yup.string().required('Required'),
      sampleOutputs: Yup.string().required('Required'),
      difficulty: Yup.string().required('Required'),
      tags: Yup.array().min(1, 'Select at least one tag').required('Required')
    }),
    onSubmit: async (values) => {
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

        const data = await response.json();
        alert('Problem added successfully!');
        navigate('/home');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit problem. Please try again.');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" {...formik.getFieldProps('title')} />
        {formik.touched.title && formik.errors.title ? <div>{formik.errors.title}</div> : null}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" {...formik.getFieldProps('description')} />
        {formik.touched.description && formik.errors.description ? <div>{formik.errors.description}</div> : null}
      </div>
      <div>
        <label htmlFor="inputDescription">Input Description</label>
        <textarea id="inputDescription" {...formik.getFieldProps('inputDescription')} />
        {formik.touched.inputDescription && formik.errors.inputDescription ? <div>{formik.errors.inputDescription}</div> : null}
      </div>
      <div>
        <label htmlFor="outputDescription">Output Description</label>
        <textarea id="outputDescription" {...formik.getFieldProps('outputDescription')} />
        {formik.touched.outputDescription && formik.errors.outputDescription ? <div>{formik.errors.outputDescription}</div> : null}
      </div>
      <div>
        <label htmlFor="sampleInputs">Sample Inputs</label>
        <textarea id="sampleInputs" {...formik.getFieldProps('sampleInputs')} />
        {formik.touched.sampleInputs && formik.errors.sampleInputs ? <div>{formik.errors.sampleInputs}</div> : null}
      </div>
      <div>
        <label htmlFor="sampleOutputs">Sample Outputs</label>
        <textarea id="sampleOutputs" {...formik.getFieldProps('sampleOutputs')} />
        {formik.touched.sampleOutputs && formik.errors.sampleOutputs ? <div>{formik.errors.sampleOutputs}</div> : null}
      </div>
      <div>
        <label htmlFor="difficulty">Difficulty</label>
        <select id="difficulty" {...formik.getFieldProps('difficulty')}>
          <option value="">Select difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        {formik.touched.difficulty && formik.errors.difficulty ? <div>{formik.errors.difficulty}</div> : null}
      </div>
      <div>
        <label htmlFor="tags">Tags</label>
        <select id="tags" multiple {...formik.getFieldProps('tags')}>
          <option value="Arrays">Arrays</option>
          <option value="DP">DP</option>
          <option value="Graphs">Graphs</option>
          <option value="Binary Search">Binary Search</option>
          {/* More options can be added here */}
        </select>
        {formik.touched.tags && formik.errors.tags ? <div>{formik.errors.tags}</div> : null}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddProblem;
