import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/helpers/auth.js";

function Footer({ className }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    isAuthenticated().then((result) => setAuthenticated(result));
  }, []);

  return (
    <footer className={`bg-[#336ee7] text-white py-3 ${className}`}>
      <img
        src="/img/logo-blanco.png"
        alt="Logo Knowlee"
        className="w-[50vw] lg:w-[30vw] mx-auto my-10"
      />
      <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-3 w-11/12 lg:w-9/12 mx-auto">
        <img
          src="/img/rocket.png"
          alt="Logo Knowlee"
          className="w-6/12 lg:w-4/12"
        />
        <div className="flex flex-col items-center w-11/12 lg:w-4/12">
          {authenticated ? (
            <Link
              to="/inicio"
              className="block w-12/12 mx-auto my-2 text-center bg-gradient-to-b from-blue-700 to-blue-600 hover:from-blue-400 hover:to-blue-400  py-3 px-7 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 drop-shadow-xl"
            >
              Ir a la plataforma
            </Link>
          ) : (
            <div className="flex justify-center gap-5 my-3">
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
          )}
          <Link
            to="/precios"
            className="block py-3 px-3 text-white font-semibold text-lg rounded hover:scale-110 transition duration-200"
          >
            Precios
          </Link>
          <Link
            to="/contacto"
            className="block py-3 px-3 text-white font-semibold text-lg rounded hover:scale-110 transition duration-200"
          >
            Contacto
          </Link>
          <Link
            to="/términos-y-condiciones"
            className="block py-3 px-3 text-white font-semibold text-lg rounded hover:scale-110 transition duration-200"
          >
            Términos y condiciones
          </Link>
        </div>
      </div>
      <p className="text-white my-3 text-sm text-center px-4">
        © 2023 Knowlee. Todos los derechos reservados. Knowlee es una marca
        registrada.
      </p>
    </footer>
  );
}

export default Footer;
