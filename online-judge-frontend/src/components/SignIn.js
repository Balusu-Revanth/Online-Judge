import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { auth, googleProvider } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  deleteUser,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { generateFirebaseAuthErrorMessage } from "../utils/authErrorHandler";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  useTheme,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
const API_URL = process.env.REACT_APP_API_URL;

const SignIn = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const idToken = await userCredential.user.getIdToken();

        await verifyUserOnBackend(idToken, userCredential.user.email);

        navigate("/home");
      } catch (error) {
        const errorMessage = generateFirebaseAuthErrorMessage(error);
        setErrors({ submit: errorMessage });
      }
      setSubmitting(false);
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${API_URL}/user/get-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
      });
      if (!response.ok) {
        await deleteUser(result.user);
        alert("User does not exist. Please sign up first.");
        navigate("/signup");
        return;
      }
      await verifyUserOnBackend(idToken, result.user.email);
      navigate("/home");
    } catch (error) {
      const errorMessage = generateFirebaseAuthErrorMessage(error);
      formik.setErrors({ submit: errorMessage });
    }
  };

  const verifyUserOnBackend = async (idToken, email) => {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
      });
      if (!response.ok) {
        await auth.signOut();
        throw new Error("Failed to verify user on backend");
      }
    } catch (error) {
      console.error("Error verifying user on backend:", error);
      formik.setErrors({ submit: "Failed to verify user on backend" });
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        sx={{
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <video
          src="/assets/logo/animated-logo.mp4"
          autoPlay
          muted
          style={{ width: "512px" }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        sx={{
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
        }}
      >
        <Container maxWidth="xs">
          <Box mb={4} textAlign="center">
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              style={{ color: theme.palette.secondary.main }}
            >
              Log in to your account
            </Typography>
            <Typography variant="body1">
              Don't have an account?{" "}
              <Button
                variant="text"
                size="large"
                style={{ textTransform: "none" }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Box mb={2}>
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
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  sx: {
                    color: "#ffffff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ffffff",
                    },
                    "&:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 30px #121212 inset",
                      WebkitTextFillColor: "#ffffff",
                    },
                  },
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                variant="outlined"
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  sx: {
                    color: "#ffffff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ffffff",
                    },
                    "&:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 30px #121212 inset",
                      WebkitTextFillColor: "#ffffff",
                    },
                  },
                }}
              />
            </Box>
            {formik.errors.submit && (
              <Box mb={2}>
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
                style={{ textTransform: "none" }}
              >
                Sign In
              </Button>
            </Box>
          </form>
          <Box mb={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              style={{ textTransform: "none" }}
            >
              Sign In with Google
            </Button>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default SignIn;
