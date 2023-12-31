import React, { createContext, useState } from "react";
import { BASE_URL } from "../utils/helpers/config.js";
import Cookies from "js-cookie";

const AuthContext = createContext();

const getCookie = (name) => {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getCookie("token") || null);

  const logout = async (callback) => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include', 
      });
      if (response.status === 200) {
        setToken(null);
        Cookies.remove('token')        
        callback();
      }
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
