import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/helpers/auth.js";
import { getAuthenticatedUser } from "../utils/users/getAuthenticateUser.js";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Feedback from "../components/Feedback";
import { formatPostDate } from "../utils/helpers/formatPostDate";
import Footer from "../components/Footer";

function PricingPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [premium, setPremium] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  useEffect(() => {
    isAuthenticated().then((result) => setAuthenticated(result));
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser();
      setUser(user);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    setPremium(user?.premium);
  }, [user]);

  return (
    <div>
      {authenticated ? (
        <Navbar />
      ) : (
        <nav className="py-4 mt-3 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <img className="h-8 w-auto lg:w-full" src="img/logo-final.png" alt="Logo" />
            </div>
            <div className="lg:flex gap-5 hidden">
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
                className="block bg-white border-solid border-2 border-blue-500  py-3 px-7 font-semibold text-lg rounded hover:scale-105 transition duration-200 drop-shadow-xl text-gray-800"
              >
                Registrarse
              </Link>
            </div>
            <div className="lg:hidden">
              <button
                onClick={handleToggleMenu}
                className="block p-2 text-gray-800"
              >
                <i className="fa-solid fa-bars fa-2x"></i>
              </button>
              {showMenu && (
                <div className="bg-white rounded-lg shadow-lg absolute top-20 left-0 w-full">
                  <Link
                    to="/precios"
                    className="block px-4 py-2 text-black hover:bg-blue-200 transition duration-200"
                  >
                    Precios
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-black hover:bg-blue-200 transition duration-200"
                  >
                    Ingresar
                  </Link>
                  <Link
                    to="/registro"
                    className="block px-4 py-2 text-black hover:bg-blue-200 transition duration-200"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
      <section className="py-10 flex flex-col justify-center bg-blue-400">
        <div className="mb-10">
          <h1 className="text-white font-bold text-center text-3xl lg:text-6xl">
            Planes de Knowlee
          </h1>
        </div>
        <div className="flex justify-center flex-wrap items-stretch gap-20 w-12/12 xl:w-9/12 mx-auto">
          <article className="glass py-8 px-20 w-10/12 xl:w-5/12 mx-auto flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-2xl mb-2">Plan básico</h2>
              <p className="font-bold text-2xl lg:text-5xl text-center mb-2 text-white">Gratis</p>
              <hr className="mt-3 mb-5" />
              <ul className="my-1 text-start list-disc w-9/12 mx-auto font-semibold text-base lg:text-lg">
                <li>Subí contenido gratuito</li>
                <li>Accedé a todos el contenido gratuito</li>
                <li>Calificá y comentá</li>
                <li>Recibí donaciones de otros usuarios</li>
              </ul>
            </div>
            <div>
              {!user && (
                <Link
                  className="block bg-gradient-to-t from-blue-500 to-[#336ee7] text-white font-semibold p-3 rounded-lg my-5 mx-auto w-full lg:w-2/4 hover:scale-105 transition duration-200 drop-shadow-xl"
                  to="/registro"
                >
                  Registrarme
                </Link>
              )}
              {user && (
                <p className="bg-gradient-to-t from-blue-500 to-[#336ee7] text-white font-semibold p-3 rounded-lg my-5 mx-auto w-full lg:w-2/4 drop-shadow-xl opacity-70">
                  Registrado/a <i className="fa-solid fa-check mx-1"></i>{" "}
                </p>
              )}
            </div>
          </article>
          <article className="glass py-8 px-20 w-10/12 xl:w-5/12 mx-auto flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-2xl mb-2 w-full">Plan premium</h2>
              <p className="font-bold text-2xl lg:text-5xl text-center mb-2 text-white">$5000/mes</p>
              <hr className="mt-3 mb-5" />
              <ul className="my-1 text-start list-disc w-11/12 lg:w-9/12 mx-auto font-semibold text-base lg:text-lg">
                <li>Subí contenido gratuito y/o de pago</li>
                <li>Accedé a todos el contenido de la plataforma</li>
                <li>Calificá y comentá</li>
                <li>Recibí donaciones de otros usuarios</li>
                <li>
                  Recibí ganancias en base a las interacciones que genere tu
                  contenido
                </li>
              </ul>
            </div>
            <div>
              {!user && (
                <Link
                  className="block text-center bg-gradient-to-t from-blue-500 to-[#336ee7] text-white font-semibold p-3 rounded-lg my-5 mx-auto w-full lg:w-2/4 hover:scale-105 transition duration-200 drop-shadow-xl"
                  to="/registro"
                >
                  Registrarme
                </Link>
              )}
              {user && !premium && (
                <Link
                  className="block text-center bg-gradient-to-t from-blue-500 to-[#336ee7] text-white font-semibold p-3 rounded-lg my-5 mx-auto w-full lg:w-2/4 hover:scale-105 transition duration-200 drop-shadow-xl"
                  to="/pagar-suscripción"
                >
                  Comprar
                </Link>
              )}
              {user && premium && (
                <div>
                  <p className="bg-gradient-to-t from-blue-500 to-[#336ee7] text-white font-semibold p-3 rounded-lg my-5 mx-auto w-full lg:w-2/4 drop-shadow-xl opacity-70">
                    Contratado <i className="fa-solid fa-check mx-1"></i>{" "}
                  </p>
                  <p className="font-semibold text-semibold">
                    Tu suscripción vence el {formatPostDate(user.deadline)}
                  </p>
                </div>
              )}
            </div>
          </article>
          <Link
            to="/código-promocional"
            className="block w-[75vw] lg:w-[50vw] bg-gradient-to-t from-blue-500 to-blue-600 p-4 rounded-lg shadow-2xl text-white text-center font-semibold hover:scale-105 transition duration-200"
          >
            Tengo un código promocional
          </Link>
        </div>
        {message && (
          <Feedback
            message={message}
            status={status}
            setMessage={setMessage}
            setStatus={setStatus}
          />
        )}
      </section>
      <Footer />
    </div>
  );
}

export default PricingPage;
