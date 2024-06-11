import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { generateFirebaseAuthErrorMessage } from '../utils/authErrorHandler';

const SignUp = () => {
  const navigate = useNavigate();
  const { setIsNewUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password')
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        setIsNewUser(true);

        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const idToken = await userCredential.user.getIdToken();
        await sendEmailVerification(userCredential.user);

        await registerUserOnBackend(idToken, {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        });

        setIsNewUser(false);

        await auth.signOut();
        navigate('/signin');

        alert('A verification email has been sent to your email address. Please verify your email before logging in.');
      } catch (error) {
        const errorMessage = generateFirebaseAuthErrorMessage(error);
        setErrors({ submit: errorMessage });
      }
      setSubmitting(false);
    }
  });

  const handleGoogleSignUp = async () => {
    try {
      setIsNewUser(true);

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch('http://localhost:8000/user/get-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken
        }
      });
      if (response.ok) {
        await auth.signOut();
        alert('User already exists. Please sign in.');
        navigate('/signin');
        return;
      }

      await registerUserOnBackend(idToken, {
        firstName: result.user.displayName.split(' ')[0],
        lastName: result.user.displayName.split(' ')[1],
        email: result.user.email,
      });

      setIsNewUser(false);

      navigate('/home');
    } catch (error) {
      const errorMessage = generateFirebaseAuthErrorMessage(error);
      formik.setErrors({ submit: errorMessage });
    }
  };

  const registerUserOnBackend = async (idToken, userDetails) => {
    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken
        },
        body: JSON.stringify(userDetails)
      });
      if (!response.ok) {
        await auth.signOut();
        throw new Error('Failed to register user on backend');
      }
    } catch (error) {
      console.error('Error registering user on backend:', error);
      formik.setErrors({ submit: 'Failed to register user on backend' });
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div style={{ color: 'red' }}>{formik.errors.firstName}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div style={{ color: 'red' }}>{formik.errors.lastName}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            autoComplete="email"
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
            autoComplete="new-password"
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={{ color: 'red' }}>{formik.errors.password}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="confirmPassword">Re-enter Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            autoComplete="new-password"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div style={{ color: 'red' }}>{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        {formik.errors.submit && (
          <div style={{ color: 'red' }}>{formik.errors.submit}</div>
        )}
        <button type="submit" disabled={formik.isSubmitting}>Sign Up</button>
      </form>
      <button onClick={handleGoogleSignUp}>Sign Up with Google</button>
      <button onClick={() => navigate('/signin')}>Already have an account? Sign In</button>
    </div>
  );
};

export default SignUp;
