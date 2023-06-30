import React, { useEffect, useState, useContext } from "react";
import { isAuthenticated } from "../utils/auth";
import { getAuthenticatedUser } from "../utils/getAuthenticateUser";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Feedback from "../components/Feedback";
import { formatPostDate } from "../utils/formatPostDate";
import Footer from "../components/Footer";
import { BASE_URL } from "../utils/config.js";
import Loader from "../components/Loader";
import { AuthContext } from "../contexts/AuthContext";

function PricingPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [premium, setPremium] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const {token} = useContext(AuthContext);

  useEffect(() => {
    isAuthenticated(token).then((result) => setAuthenticated(result));
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser(token);
      setUser(user);
      console.log(user);
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    setPremium(user?.premium);
  }, [user]);

  const toggleCancel = () => {
    setShowCancel(!showCancel);
  };

  const handlePremiumSubmit = async () => {
    if (!user) {
      setMessage("Inicia sesión para acceder a esta función");
      setStatus("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/premium`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);
      if (data.status === "success") setPremium(true);
      setShowCancel(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleCancelSubmit = async () => {
    if (!user) {
      setMessage("Inicia sesión para acceder a esta función");
      setStatus("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/cancel-premium`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);
      if (data.status === "success") setPremium(false);
      setShowCancel(false);
      setLoading(false);
    } catch (error) {
      setLoading(false); 
      console.log(error);
    }
  };

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
                className="block bg-gradient-to-b from-blue-700 to-blue-500 hover:from-blue-400 hover:to-blue-400  py-3 px-7 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 drop-shadow-xl"
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
      <section className="py-10 flex flex-col justify-center bg-blue-400">
        <div className="mb-10">
          <h1 className="text-white font-bold text-center text-6xl">
            Planes de Knowlee
          </h1>
        </div>
        <div className="flex justify-center flex-wrap items-stretch gap-20 w-12/12 xl:w-9/12 mx-auto">
          <article className="glass py-8 px-20 w-10/12 xl:w-5/12 mx-auto flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-2xl mb-2">Plan básico</h2>
              <p className="font-bold text-5xl mb-2 text-white">Gratis</p>
              <hr className="mt-3 mb-5" />
              <ul className="my-1 text-start list-disc w-9/12 mx-auto font-semibold text-lg">
                <li>Subí contenido gratuito</li>
                <li>Accedé a todos el contenido gratuito</li>
                <li>Calificá y comentá</li>
                <li>Recibí donaciones de otros usuarios</li>
              </ul>
            </div>
            <div>
              {!user && (
                <Link
                  className="block bg-gradient-to-t from-blue-500 to-[#336ee7] text-white font-semibold p-3 rounded-lg my-5 mx-auto w-2/4 hover:scale-105 transition duration-200 drop-shadow-xl"
                  to="/registro"
                >
                  Registrarme
                </Link>
              )}
              {user && (
                <p className="bg-gradient-to-t from-blue-500 to-[#336ee7] text-white font-semibold p-3 rounded-lg my-5 mx-auto w-2/4 drop-shadow-xl opacity-70">
                  Registrado/a <i className="fa-solid fa-check mx-1"></i>{" "}
                </p>
              )}
            </div>
          </article>
          <article className="glass py-8 px-20 w-10/12 xl:w-5/12 mx-auto flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-2xl mb-2 w-full">Plan premium</h2>
              <p className="font-bold text-5xl mb-2 text-white">$5000/mes</p>
              <hr className="mt-3 mb-5" />
              <ul className="my-1 text-start list-disc w-9/12 mx-auto font-semibold text-lg">
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
                  className="block bg-gradient-to-t from-blue-500 to-[#336ee7] text-white font-semibold p-3 rounded-lg my-5 mx-auto w-2/4 hover:scale-105 transition duration-200 drop-shadow-xl"
                  to="/registro"
                >
                  Registrarme
                </Link>
              )}
              {user && !premium && (
                <Button
                  text={loading ? <Loader className='my-0'/> : "Comprar"}
                  type="submit"
                  onClick={handlePremiumSubmit}
                />
              )}
              {user && premium && (
                <div>
                  <p className="bg-gradient-to-t from-blue-500 to-[#336ee7] text-white font-semibold p-3 rounded-lg my-5 mx-auto w-2/4 drop-shadow-xl opacity-70">
                    Contratado <i className="fa-solid fa-check mx-1"></i>{" "}
                  </p>
                  <p className="font-semibold text-semibold">
                    Tu suscripción vence el {formatPostDate(user.deadline)}
                  </p>
                  <p
                    className="font-semibold text-semibold underline cursor-pointer"
                    onClick={toggleCancel}
                  >
                    Cancelar ahora
                  </p>
                  {showCancel && (
                    <div className="my-2">
                      <p className="font-semibold text-semibold text-lg">
                        ¿Querés cancelar la suscripción?
                      </p>
                      <p
                        className="font-semibold text-semibold bg-gradient-to-t from-red-400 to-red-600 rounded-lg my-1 p-2 text-white cursor-pointer"
                        onClick={handleCancelSubmit}
                      >
                        Sí, cancelar
                      </p>
                      <p
                        className="font-semibold text-semibold bg-gradient-to-t from-blue-500 to-[#336ee7] rounded-lg my-1 p-2 text-white cursor-pointer"
                        onClick={toggleCancel}
                      >
                        No, mantener
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
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
