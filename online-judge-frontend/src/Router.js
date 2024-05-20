import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Account from './components/Account';
import ProtectedRoute from './components/ProtectedRoute';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<ProtectedRoute component={Home} />} />
        <Route path="/account" element={<ProtectedRoute component={Account} />} />
        <Route path="/" element={<ProtectedRoute component={Home} />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;