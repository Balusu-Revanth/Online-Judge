import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { auth, googleProvider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { generateFirebaseAuthErrorMessage } from '../utils/authErrorHandler';

const SignIn = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required')
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigate('/home');
      } catch (error) {
        const errorMessage = generateFirebaseAuthErrorMessage(error);
        setErrors({ submit: errorMessage });
      }
      setSubmitting(false);
    }
  });

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/home');
    } catch (error) {
      const errorMessage = generateFirebaseAuthErrorMessage(error);
      formik.setErrors({ submit: errorMessage });
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div style={{ color: 'red' }}>{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={{ color: 'red' }}>{formik.errors.password}</div>
          ) : null}
        </div>
        {formik.errors.submit && (
          <div style={{ color: 'red' }}>{formik.errors.submit}</div>
        )}
        <button type="submit" disabled={formik.isSubmitting}>Sign In</button>
      </form>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
    </div>
  );
};

export default SignIn;
