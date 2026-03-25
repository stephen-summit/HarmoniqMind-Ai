import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AssistantPage from "./pages/AssistantPage";
import About from "./pages/About";
import SignInComponent from "./components/SignInComponent";
import ProtectedRoute from "./components/ProtectedRoute";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* Sign-in page */}
        <Route path="/login" element={<SignInComponent />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home apiBase={API_BASE} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assistant/:type"
          element={
            <ProtectedRoute>
              <AssistantPage apiBase={API_BASE} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
