import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import DashboardContainer from "./Pages/DashboardContainer";
import Modal from "./components/Modal";
import "./App.css";
import store from "./store/store.js";
import { Provider } from "react-redux";
import Trial from "./Pages/Trial.jsx";

function App() {
  const { user, logout, isHydrated } = useAuth();

  if (!isHydrated) return null;

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen relative bg-slate-950 text-slate-100 font-sans">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route
              path="/login"
              element={
                <Modal isOpen={true} onClose={() => window.location.href = "/"}>
                  <Login />
                </Modal>
              }
            />
            <Route path="/trial" element={<Trial />} />
            <Route
              path="/register"
              element={
                <Modal isOpen={true} onClose={() => window.location.href = "/"}>
                  <Register />
                </Modal>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                user ? (
                  <DashboardContainer />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
