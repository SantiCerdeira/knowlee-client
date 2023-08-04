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
import Groups from "./pages/Groups";
import GroupPage from "./pages/GroupPage";
import GroupPostPage from "./pages/GroupPostPage";
import ContactPage from "./pages/ContactPage";
import PaymentPage from "./pages/PaymentPage";
import PromoCode from "./pages/PromoCode";
import FavoritePosts from "./pages/FavoritePosts";
import NewPasswordRequest from "./pages/NewPasswordRequest";
import TermsAndConditions from "./pages/TermsAndConditions";
import NewPassword from "./pages/NewPassword";
import Notifications from "./pages/Notifications";
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
          <Route path="/grupos" element={<Groups />} />
          <Route path="/grupo/:groupId" element={<GroupPage />} />
          <Route path="/grupo/post/:postId" element={<GroupPostPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/pagar-suscripción" element={<PaymentPage />} />
          <Route path="/código-promocional" element={<PromoCode />} />
          <Route path="/posts/guardados" element={<FavoritePosts />} />
          <Route path="/términos-y-condiciones" element={<TermsAndConditions />} />
          <Route path="/cambiar-contraseña/:token" element={<NewPassword />} />
          <Route path="/notificaciones/:userId" element={<Notifications />} />


          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
    </AuthProvider>
  );
}

export default App;
