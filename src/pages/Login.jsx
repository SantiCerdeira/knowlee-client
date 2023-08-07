import React, { useState } from "react";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { BASE_URL } from "../utils/helpers/config.js";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!values.email) {
      formErrors.email = "Ingresá un email";
      isValid = false;
    }

    if (!values.password) {
      formErrors.password = "Ingresá una contraseña";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const dataToSend = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setLoginError(message);
        setLoading(false);
        return;
      }

      setValues({
        email: "",
        password: "",
      });

      navigate("/perfil");
    } catch (error) {
      setLoginError(
        "Error en el inicio de sesión. Por favor, intentá nuevamente."
      );
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="bg-container overflow-x-hidden">
      <svg
        className="blob"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="50" fill="#bde0fe" />
      </svg>
      <svg
        className="blob"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="50" fill="#bde0fe" />
      </svg>
      <svg
        className="blob"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="50" fill="#bde0fe" />
      </svg>
      <Link
        to="/"
        className="w-[60%] lg:w-[25%] text-lg lg:text-2xl font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg text-center block m-5 hover:bg-blue-400 focus:bg-blue-400"
      >
        <i className="fa-solid fa-arrow-left"></i> Volver al inicio
      </Link>
      <section>
        <img
          src="img/logo-final.png"
          alt="Logo Knowlee"
          className="w-56 mx-auto my-7"
        />
        <div className="bg-white rounded-lg border-solid border-2 border-blue-600 w-[95vw] lg:w-[75vw] xl:w-[50vw] mx-auto py-10 shadow-lg mb-20">
          <i className="fa-solid fa-user fa-2xl my-5"></i>
          <h1 className="text-center font-bold text-3xl">Iniciar sesión</h1>
          <hr className="w-8/12 mx-auto" />
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-around items-center py-10 w-10/12 lg:w-8/12 mx-auto"
          >
            <div className="w-full my-1">
              <Label text="Email:" htmlFor="email" />
              <Input
                type="email"
                placeholder="Ingresa tu email"
                value={values.email}
                onChange={handleChange("email")}
                name="email"
                id="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-start  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i> {errors.email}
                </p>
              )}
            </div>
            <div className="w-full my-1">
              <Label text="Contraseña:" htmlFor="password" />
              <Input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={values.password}
                onChange={handleChange("password")}
                name="password"
                id="password"
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-start  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i> {errors.password}
                </p>
              )}
              <Link
                className="block text-gray-500 text-end my-1"
                to="/contraseña-olvidada"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            {loginError && (
              <p className="text-start  text-red-700 rounded-lg p-1">
                <i className="fa-solid fa-xmark fa-lg"></i> {loginError}
              </p>
            )}
            {loading && <Loader />}
            <Button text="Iniciar sesión" type="submit" />
            <p className="text-gray-500">
              ¿No tenés una cuenta?{" "}
              <Link to="/registro" className="underline">
                Registrate
              </Link>
            </p>
          </form>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default Login;
