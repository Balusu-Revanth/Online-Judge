import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { auth, googleProvider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { generateFirebaseAuthErrorMessage } from '../utils/authErrorHandler';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { setAdmin } = useAuth();

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
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const idToken = await userCredential.user.getIdToken();

        await verifyUserOnBackend(idToken, userCredential.user.email);

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
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      await verifyUserOnBackend(idToken, result.user.email);

      navigate('/home');
    } catch (error) {
      const errorMessage = generateFirebaseAuthErrorMessage(error);
      formik.setErrors({ submit: errorMessage });
    }
  };

  const verifyUserOnBackend = async (idToken, email) => {
    try {
      const response = await fetch('http://localhost:8000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken
        }
      });
      if (!response.ok) {
        await auth.signOut();
        throw new Error('Failed to verify user on backend');
      } else {
        const user = await response.json();
        setAdmin(user.isAdmin);
      }
    } catch (error) {
      console.error('Error verifying user on backend:', error);
      formik.setErrors({ submit: 'Failed to verify user on backend' });
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
            autoComplete='email'
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
