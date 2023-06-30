import React, { useState, useEffect, useContext } from "react";
import { isAuthenticated } from "../utils/auth";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { AuthContext } from "../contexts/AuthContext";

function NotFoundPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    isAuthenticated(token).then((result) => setAuthenticated(result));
  }, [token]);

  return (
    <div>
      {authenticated ? (
        <Navbar />
      ) : (
        <nav className="py-4 mt-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  className="h-8 w-full"
                  src="img/logo-final.png"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="flex justify-around gap-5">
              <Link
                to="/precios"
                className="block py-3 px-3 text-black font-semibold text-lg rounded hover:scale-110 transition duration-200"
              >
                Precios
              </Link>
              <Link
                to="/login"
                className="block bg-gradient-to-b from-blue-700 to-blue-600 hover:from-blue-400 hover:to-blue-400  py-3 px-7 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 drop-shadow-xl"
              >
                Ingresar
              </Link>
              <Link
                to="/registro"
                className="block bg-white hover:from-blue-400 hover:to-blue-400 border-solid border-2 border-blue-500  py-3 px-7 font-semibold text-lg rounded hover:scale-105 transition duration-200 drop-shadow-xl text-gray-800"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </nav>
      )}
      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <img
          className="w-3/12 lg:w-2/12"
          src="img/logo-final.png"
          alt="Logo Knowlee"
        />
        <h1 className="text-blue-600 font-bold text-4xl lg:text-6xl text-center my-10">
          404: Página no encontrada
        </h1>
        <img
          className="w-3/12 lg:w-2/12"
          src="img/pulgar-abajo.png"
          alt="Logo Knowlee"
        />
        {authenticated && (
          <Link
            to="/inicio"
            className="block bg-gradient-to-b from-blue-700 to-blue-600 hover:from-blue-400 hover:to-blue-400  py-3 px-7 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 drop-shadow-xl"
          >
            Ir al inicio
          </Link>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default NotFoundPage;
