import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/helpers/auth.js";

const TermsAndConditions = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  useEffect(() => {
    isAuthenticated().then((result) => setAuthenticated(result));
  }, []);

  return (
    <div className="bg-white">
      {authenticated ? (
        <Navbar />
      ) : (
        <nav className="py-4 mt-3 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="">
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
      <div className="p-8 text-start">
        <header>
          <h1 className="text-4xl font-bold mb-4">
            Condiciones de Uso - Knowlee
          </h1>
        </header>

        <main>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Bienvenido a Knowlee</h2>
            <p className="text-lg mb-4">
              ¡Bienvenido a Knowlee, la plataforma educativa para compartir y
              aprender sobre diferentes temas! Al usar nuestra aplicación y
              servicios, aceptas cumplir con los términos y condiciones
              establecidos a continuación. Por favor, léelos cuidadosamente
              antes de continuar.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Subida de Documentos</h2>
            <p className="text-lg mb-4">
              En Knowlee, los usuarios pueden subir documentos y materiales de
              estudio sobre diversos temas. Sin embargo, es importante destacar
              que todos los documentos subidos serán marcados con una marca de
              agua para evitar problemas de derechos de autor. Al subir
              cualquier contenido, confirmas que tienes los derechos legales
              para compartirlo y aceptas que será marcado con una marca de agua.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Ganar Dinero en Knowlee</h2>
            <p className="text-lg mb-4">
              En Knowlee, creemos en recompensar a nuestros usuarios
              comprometidos. Puedes ganar dinero de dos formas:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>
                Donaciones: Los usuarios pueden recibir donaciones de otros
                usuarios que encuentren valor en sus documentos y
                contribuciones. Fomentamos un ambiente de apoyo y colaboración
                en nuestra comunidad educativa.
              </li>
              <li>
                Pagos por Engage: Además de donaciones, aquellos usuarios que
                generen un alto nivel de engagement con sus documentos y
                obtengan un gran número de vistas e interacciones también pueden
                recibir pagos adicionales por parte de Knowlee. Nuestro sistema
                de puntuación recompensa la calidad y relevancia del contenido.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Responsabilidad del Usuario
            </h2>
            <p className="text-lg mb-4">
              Como usuario de Knowlee, aceptas ser responsable de tus acciones y
              del contenido que compartes. No permitimos la publicación de
              contenido ofensivo, inapropiado o ilegal. Cualquier violación de
              estas reglas puede resultar en la suspensión o eliminación de tu
              cuenta y contenido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2">
              Cambios en los Términos y Condiciones
            </h2>
            <p className="text-lg mb-4">
              Nos reservamos el derecho de modificar estos Términos y
              Condiciones en cualquier momento. Te notificaremos sobre cualquier
              cambio importante a través de tu cuenta o por correo electrónico.
              Te recomendamos revisar periódicamente estos términos para
              mantenerte informado de cualquier actualización.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
