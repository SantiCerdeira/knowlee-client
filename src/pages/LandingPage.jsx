import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import Feature from "../components/Feature";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";
import { AuthContext } from "../contexts/AuthContext";

function LandingPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const {token} = useContext(AuthContext);

  useEffect(() => {
    isAuthenticated(token).then((result) => setAuthenticated(result));
  }, [token]);

  return (
    <div>
      <nav className="py-4 mt-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="">
            <img className="h-8 w-full" src="img/logo-final.png" alt="Logo" />
          </div>
          <div>
            {authenticated ? (
              <Link
                to="/inicio"
                className="block bg-gradient-to-b from-blue-700 to-blue-600 hover:from-blue-400 hover:to-blue-400  py-3 px-7 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 drop-shadow-xl"
              >
                Ir a la plataforma
              </Link>
            ) : (
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
            )}
          </div>
        </div>
      </nav>
      <hr className="w-full lg:w-3/4 mx-auto mb-4" />
      <section className="min-h-[80vh] flex flex-col justify-center py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap">
          <div className="w-11/12 lg:w-7/12 px-5 text-start mx-auto">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-3">
              Compartí, aprendé <br></br> y crecé con nuestra plataforma de
              apuntes <br></br> en línea
            </h1>
            <p className="text-md lg:text-lg">
              Unite a nuestra plataforma y compartí tus apuntes y documentos con
              otros estudiantes y profesionales. Descubrí nuevas perspectivas y
              mejorá <br></br> tu aprendizaje con la sabiduría colectiva.
            </p>
            <div>
              {authenticated ? (
                <Link
                  to="/inicio"
                  className="block w-10/12 lg:w-6/12 mx-auto my-5 text-center bg-gradient-to-b from-blue-700 to-blue-600 hover:from-blue-400 hover:to-blue-400  py-3 px-7 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 drop-shadow-xl"
                >
                  Ir a la plataforma
                </Link>
              ) : (
                <div className="flex justify-center gap-5 my-3">
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
              )}
            </div>
          </div>
          <div className="w-11/12 lg:w-4/12 mx-auto">
            <img className="h-full w-full" src="img/notebook.png" alt="Libro" />
          </div>
        </div>
      </section>
      <section className="bg-white py-10 w-full xl:w-[80vw] mx-auto">
        <h2 className="text-5xl bg-clip-text text-transparent font-bold bg-gradient-to-t from-gray-500 to-black">
          Funciones destacadas
        </h2>
        <div className="flex flex-wrap justify-around my-10">
          <Feature
            text="Accedé a contenido de calidad"
            img="black-folder.png"
            className="lg:w-3/12"
          />
          <Feature
            text="Conectate con otras personas que compartan tus intereses"
            img="chat.png"
            className="lg:w-6/12"
          />
          <Feature
            text="Compartí tus documentos de forma segura"
            img="lock.png"
            className="lg:w-3/12"
          />
          <Feature
            text="Ganá dinero gracias a tu conocimiento"
            img="money.png"
            className="lg:w-full"
          />
          <Feature
            text="Precios accesibles"
            img="coin.png"
            className="lg:w-6/12"
          />
          <Feature
            text="Atención al cliente"
            img="phone-call.png"
            className="lg:w-6/12"
          />
        </div>
      </section>
      <section className="bg-white py-10">
        <h2 className="text-5xl font-bold">Testimonios</h2>
        <p className="text-md my-3 text-center ">
          Clickeá en la foto de un usuario para ver su testimonio
        </p>
        <div className="flex justify-around gap-3 my-10">
          <Testimonial />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;
