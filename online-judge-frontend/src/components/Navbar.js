import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import {
  deleteUser,
  sendPasswordResetEmail,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
const API_URL = process.env.REACT_APP_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { admin, token } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = React.useState(null);
  const [error, setError] = React.useState("");

  useEffect(() => {
    if (error) {
      alert(error);
      setError("");
    }
  }, [error]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDeletion) {
      try {
        const user = auth.currentUser;
        if (user) {
          const password = prompt(
            "Please enter your password to confirm deletion:"
          );
          if (!password) {
            alert("Password is required for re-authentication.");
            return;
          }

          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential);

          const response = await fetch(`${API_URL}/user/delete-user`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to delete user data from backend.");
          }

          await deleteUser(user);
          alert("Account deleted successfully.");
          navigate("/signup");
        }
      } catch (error) {
        alert("Error deleting account: " + error.message);
      }
    }
  };

  const handleResetPassword = async () => {
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        await sendPasswordResetEmail(auth, user.email);
        alert("Password reset email sent. You will be logged out.");
        await signOut(auth);
        navigate("/signin");
      } else {
        alert("No user is currently logged in.");
      }
    } catch (error) {
      alert("Error sending password reset email: " + error.message);
    }
  };

  return (
    <AppBar
      position="fixed"
      color="secondary"
      sx={{ width: "100%", zIndex: 9999 }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/logo/logo.png`}
            alt="Logo"
            style={{ height: 50, marginRight: 10, cursor: "pointer" }}
            onClick={() => navigate("/home")}
          />
        </Box>
        {admin && (
          <Button
            color="inherit"
            style={{ textTransform: "none" }}
            onClick={() => navigate("/add-problem")}
          >
            Add Problem
          </Button>
        )}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="account settings"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: "45px" }}
        >
          <MenuItem
            onClick={handleSettingsMenuOpen}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
              padding: "10px 20px",
            }}
          >
            Account Settings
          </MenuItem>
          <MenuItem
            onClick={handleSignOut}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
              padding: "10px 20px",
            }}
          >
            Sign Out
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={settingsAnchorEl}
          open={Boolean(settingsAnchorEl)}
          onClose={handleSettingsMenuClose}
          sx={{ mt: "45px" }}
        >
          <MenuItem
            onClick={handleDeleteAccount}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
              padding: "10px 20px",
            }}
          >
            Delete Account
          </MenuItem>
          <MenuItem
            onClick={handleResetPassword}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
              padding: "10px 20px",
            }}
          >
            Reset Password
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
