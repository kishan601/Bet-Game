  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

  import Login from "./pages/Login";
  import Register from "./pages/Register";
  import Game from "./pages/Game";
  import Admin from "./pages/Admin";

  import ProtectedRoute from "./routes/ProtectedRoute";
  import AdminRoute from "./routes/adminRoute";

  import { Navigate } from "react-router-dom";
  import { useAuth } from "./context/AuthContext";

  const HomeRedirect = () => {
    const { user } = useAuth();

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.isAdmin) {
      return <Navigate to="/admin" />;
    }

    return <Navigate to="/register" />;
  };

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 

          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    );
  }

  export default App;