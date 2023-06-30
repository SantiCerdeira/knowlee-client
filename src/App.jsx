import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import PricingPage from "./pages/PricingPage";
import UserProfile from "./pages/UserProfile";
import NotFoundPage from "./pages/NotFoundPage";
import ChatPage from "./pages/ChatPage";
import NewPasswordRequest from "./pages/NewPasswordRequest";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/precios" element={<PricingPage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
          <Route path="/usuarios/:userId" element={<UserProfile />} />
          <Route path="/contraseña-olvidada" element={<NewPasswordRequest />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
    </AuthProvider>
  );
}

export default App;
