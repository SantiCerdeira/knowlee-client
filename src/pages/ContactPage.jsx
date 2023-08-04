import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../utils/helpers/auth.js";
import Label from "../components/Label";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Atropos from "atropos/react";
import "atropos/css";
import Input from "../components/Input";
import Feedback from "../components/Feedback";

function ContactPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [values, setValues] = useState({
    email: "",
    name: "",
    message: "",
  });

  const handleToggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  useEffect(() => {
    isAuthenticated().then((result) => setAuthenticated(result));
  }, []);

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("Mensaje enviado correctamente");
    setStatus("success");

    setValues({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="bg-blue-600">
      <nav className="py-4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="">
            <img className="h-8 w-full" src="img/logo-blanco.png" alt="Logo" />
          </div>
          <div className="lg:flex gap-5 hidden">
            {authenticated ? (
              <Link
                to="/inicio"
                className="block bg-gradient-to-b from-blue-700 to-blue-600 hover:from-blue-400 hover:to-blue-400  py-3 px-7 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 drop-shadow-xl"
              >
                Ir a la plataforma
              </Link>
            ) : (
              <>
                <Link
                  to="/precios"
                  className="block py-3 px-3 text-white font-semibold text-lg rounded hover:scale-110 transition duration-200"
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
              </>
            )}
          </div>
          <div className="lg:hidden">
            <button onClick={handleToggleMenu} className="block p-2 text-white">
              <i className="fa-solid fa-bars fa-2x"></i>
            </button>
            {showMenu && (
              <div className="bg-white rounded-lg shadow-lg absolute top-20 left-0 w-full">
                {authenticated ? (
                  <Link
                    to="/inicio"
                    className="block px-4 py-2 text-black hover:bg-blue-200 transition duration-200"
                  >
                    Ir a la plataforma
                  </Link>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="bg-blue-600 min-h-[100vh]">
        <h1 className="text-white font-bold text-4xl lg:text-6xl text-center my-10">
          Contacto
        </h1>
        <div className="flex flex-col-reverse lg:flex-row justify-around items-center">
          <Atropos
            shadow={false}
            highlight={false}
            activeOffset={2}
            className="w-11/12 lg:w-5/12"
          >
            <img
              id="message-image"
              className=" mx-auto"
              src="/img/mensaje.png"
              alt="Logo Knowlee"
            />
          </Atropos>
          <div className="glass p-8 w-11/12 lg:w-5/12  mx-auto  rounded-lg shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label text="Nombre:" htmlFor="name" className="text-white" />
                  <Input
                    type="text"
                    placeholder="Ingresá tu nombre"
                    value={values.name}
                    onChange={handleChange("name")}
                    name="name"
                    id="name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    text="Correo electrónico:"
                    htmlFor="email"
                    className="text-white"
                  />
                  <Input
                    type="email"
                    placeholder="Ingresa tu email"
                    value={values.email}
                    onChange={handleChange("email")}
                    name="email"
                    id="email"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    text="Mensaje:"
                    htmlFor="message"
                    className="text-white"
                  />
                  <Input
                    type="textarea"
                    placeholder="Ingresa el mensaje"
                    value={values.message}
                    onChange={handleChange("message")}
                    name="message"
                    id="message"
                    className="pb-36"
                  />
                </div>
                <Button text="Enviar" type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-white min-h-[30vh] p-20 flex flex-wrap justify-around">
        <div className="w-11/12 lg:w-3/12 mx-auto my-3 bg-gradient-to-t from-white to-gray-100 p-8 rounded-md shadow-lg flex flex-col justify-center items-center">
          <img src="/img/calendario.png" alt="Teléfono" className="w-20 h-20" />
          <h3 className="text-3xl font-bold text-black my-2">Servicio 24/7</h3>
        </div>
        <div className="w-11/12 lg:w-3/12 mx-auto my-3 bg-gradient-to-t from-white to-gray-100 p-8 rounded-md shadow-lg flex flex-col justify-center items-center">
          <img src="/img/estrella.png" alt="Teléfono" className="w-20 h-20" />
          <h3 className="text-3xl font-bold text-black my-2">
            Atención de calidad
          </h3>
        </div>
        <div className="w-11/12 lg:w-3/12 mx-auto my-3 bg-gradient-to-t from-white to-gray-100 p-8 rounded-md shadow-lg flex flex-col justify-center items-center">
          <img src="/img/reloj.png" alt="Teléfono" className="w-20 h-20" />
          <h3 className="text-3xl font-bold text-black my-2">
            Respuestas en tiempo récord
          </h3>
        </div>
      </div>
      {message && (
        <Feedback
          message={message}
          status={status}
          setMessage={setMessage}
          setStatus={setStatus}
        />
      )}
      <Footer />
    </div>
  );
}

export default ContactPage;
