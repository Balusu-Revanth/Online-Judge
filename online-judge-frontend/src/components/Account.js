import React from 'react';
import { auth } from '../config/firebase';
import { deleteUser, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmDeletion = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDeletion) {
      try {
        const user = auth.currentUser;
        if (user) {
          await deleteUser(user);
          alert('Account deleted successfully.');
          navigate('/signup');
        }
      } catch (error) {
        alert('Error deleting account: ' + error.message);
      }
    }
  };

  const handleResetPassword = async () => {
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        await sendPasswordResetEmail(auth, user.email);
        alert('Password reset email sent. You will be logged out.');
        await signOut(auth);
        navigate('/signin');
      } else {
        alert('No user is currently logged in.');
      }
    } catch (error) {
      alert('Error sending password reset email: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Account Settings</h2>
      <button onClick={handleDeleteAccount}>Delete Account</button>
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default Account;
