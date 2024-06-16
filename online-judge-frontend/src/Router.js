import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import AddProblem from "./components/AddProblem";
import ProblemDetail from "./components/ProblemDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<ProtectedRoute component={Home} />} />
        <Route
          path="/add-problem"
          element={<AdminRoute component={AddProblem} />}
        />
        <Route
          path="/problems/:id"
          element={<ProtectedRoute component={ProblemDetail} />}
        />
        <Route path="/" element={<ProtectedRoute component={Home} />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
