import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { generateFirebaseAuthErrorMessage } from "../utils/authErrorHandler";
const API_URL = process.env.REACT_APP_API_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const { setIsNewUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        setIsNewUser(true);

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const idToken = await userCredential.user.getIdToken();
        await sendEmailVerification(userCredential.user);

        await registerUserOnBackend(idToken, {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        });

        setIsNewUser(false);

        await auth.signOut();
        navigate("/signin");

        alert(
          "A verification email has been sent to your email address. Please verify your email before logging in."
        );
      } catch (error) {
        const errorMessage = generateFirebaseAuthErrorMessage(error);
        setErrors({ submit: errorMessage });
      }
      setSubmitting(false);
    },
  });

  const handleGoogleSignUp = async () => {
    try {
      setIsNewUser(true);

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${API_URL}/user/get-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
      });
      if (response.ok) {
        await auth.signOut();
        alert("User already exists. Please sign in.");
        navigate("/signin");
        return;
      }

      await registerUserOnBackend(idToken, {
        firstName: result.user.displayName.split(" ")[0],
        lastName: result.user.displayName.split(" ")[1],
        email: result.user.email,
      });

      setIsNewUser(false);

      navigate("/home");
    } catch (error) {
      const errorMessage = generateFirebaseAuthErrorMessage(error);
      formik.setErrors({ submit: errorMessage });
    }
  };

  const registerUserOnBackend = async (idToken, userDetails) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify(userDetails),
      });
      if (!response.ok) {
        await auth.signOut();
        throw new Error("Failed to register user on backend");
      }
    } catch (error) {
      console.error("Error registering user on backend:", error);
      formik.setErrors({ submit: "Failed to register user on backend" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={3} mb={2} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Create your account
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Box mb={1}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            variant="outlined"
          />
        </Box>
        <Box mb={1}>
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            variant="outlined"
          />
        </Box>
        <Box mb={1}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            autoComplete="email"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            variant="outlined"
          />
        </Box>
        <Box mb={1}>
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            variant="outlined"
          />
        </Box>
        <Box mb={1}>
          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            variant="outlined"
          />
        </Box>
        {formik.errors.submit && (
          <Box mb={1}>
            <Typography color="error">{formik.errors.submit}</Typography>
          </Box>
        )}
        <Box mb={2}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting}
          >
            Sign Up
          </Button>
        </Box>
      </form>
      <Box mb={2}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleGoogleSignUp}
          startIcon={<GoogleIcon />}
        >
          Sign Up with Google
        </Button>
      </Box>
      <Box mb={2} textAlign="center">
        <Typography variant="body1">
          Have an account?{" "}
          <Button
            variant="text"
            style={{ textTransform: "none" }}
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;
