import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Welcome to Home Page</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={() => navigate('/account')}>Account Settings</button>
    </div>
  );
};

export default Home;
