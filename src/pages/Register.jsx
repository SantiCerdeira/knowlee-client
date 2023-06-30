import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { BASE_URL } from "../utils/config.js";
import { AuthContext } from "../contexts/AuthContext";

const Register = () => {
  const [values, setValues] = useState({
    name: "",
    lastName: "",
    userName: "",
    date: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
  };

  const validateForm = () => {
    setRegisterError("");
    let formErrors = {};
    let isValid = true;

    if (!values.name) {
      formErrors.name = "Ingresá tu nombre";
      isValid = false;
    }

    if (!values.lastName) {
      formErrors.lastName = "Ingresá tu apellido";
      isValid = false;
    }

    if (!values.userName) {
      formErrors.userName = "Ingresá un nombre de usuario";
      isValid = false;
    }

    if (!values.email) {
      formErrors.email = "Ingresá un email";
      isValid = false;
    }

    if (!values.date) {
      formErrors.date = "Seleccioná una fecha";
      isValid = false;
    }

    if (values.password !== values.confirmPassword) {
      formErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    if (!values.password) {
      formErrors.password = "Ingresá una contraseña";
      isValid = false;
    }

    if (values.password && values.password.length < 6) {
      formErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (!values.confirmPassword) {
      formErrors.confirmPassword = "Volvé a ingresar la contraseña";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const dataToSend = {
      name: values.name,
      lastName: values.lastName,
      userName: values.userName,
      date: values.date,
      email: values.email,
      password: values.password,
    };

    try {
      const response = await fetch(`${BASE_URL}/registro`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setRegisterError(message);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log(data);

      setValues({
        name: "",
        lastName: "",
        userName: "",
        date: "",
        email: "",
        password: "",
      });

      navigate("/login");
    } catch (error) {
      setRegisterError("Error en el registro. Por favor, intentá nuevamente.");
      setLoading(false);
      return console.log(error);
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
        className="w-[50%] lg:w-[25%] text-2xl font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg text-center block m-5 hover:bg-blue-400 focus:bg-blue-400"
      >
        <i className="fa-solid fa-arrow-left"></i> Volver al inicio
      </Link>
      <section>
        <img
          src="img/logo-final.png"
          alt="Logo Knowlee"
          className="w-56 mx-auto my-7"
        />
        <div className="bg-white rounded-lg border-solid border-2 border-blue-600 w-[50vw] mx-auto py-10 shadow-lg">
          <i className="fa-solid fa-user fa-2xl my-5"></i>
          <h3 className="text-center font-bold text-3xl">Registrarse</h3>
          <a
            href="/registro"
            className="bg-[#f1f1f1] block text-center w-8/12 mx-auto my-5 shadow-inner p-3 hover:shadow-none transition duration-300"
          >
            Registrarse con Google{" "}
            <i className="fa-brands fa-google fa-xl ml-2"></i>
          </a>
          <hr className="w-8/12 mx-auto" />
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-around items-center py-10 w-8/12 mx-auto"
          >
            <div className="w-full my-1">
              <Label text="Nombre:" htmlFor="name" />
              <Input
                type="text"
                placeholder="Ingresá tu nombre"
                value={values.name}
                onChange={handleChange("name")}
                name="name"
                id="name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-start  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i> {errors.name}
                </p>
              )}
            </div>
            <div className="w-full my-1">
              <Label text="Apellido:" htmlFor="lastName" />
              <Input
                type="text"
                placeholder="Ingresá tu apellido"
                value={values.lastName}
                onChange={handleChange("lastName")}
                name="lastName"
                id="lastName"
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-start  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i> {errors.lastName}
                </p>
              )}
            </div>
            <div className="w-full my-1">
              <Label text="Nombre de usuario:" htmlFor="userName" />
              <Input
                type="text"
                placeholder="Ingresá tu nombre de usuario"
                value={values.userName}
                onChange={handleChange("userName")}
                name="userName"
                id="userName"
                aria-invalid={!!errors.userName}
              />
              {errors.userName && (
                <p className="text-start  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i> {errors.userName}
                </p>
              )}
            </div>
            <div className="w-full my-1">
              <Label text="Email:" htmlFor="email" />
              <Input
                type="email"
                placeholder="Ingresá tu email"
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
              <Label text="Fecha de nacimiento:" htmlFor="date" />
              <Input
                type="date"
                value={values.date}
                onChange={handleChange("date")}
                name="date"
                id="date"
                aria-invalid={!!errors.date}
              />
              {errors.date && (
                <p className="text-start  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i> {errors.date}
                </p>
              )}
            </div>
            <div className="w-full my-1">
              <Label text="Contraseña:" htmlFor="password" />
              <Input
                type="password"
                placeholder="Ingresá tu contraseña"
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
            </div>
            <div className="w-full my-1">
              <Label text="Confirmar contraseña:" htmlFor="confirmPassword" />
              <Input
                type="password"
                placeholder="Volvé a ingresar tu contraseña"
                value={values.confirmPassword}
                onChange={handleChange("confirmPassword")}
                name="confirmPassword"
                id="confirmPassword"
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-start  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i>{" "}
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {registerError && (
              <p className="text-start  text-red-700 rounded-lg p-1">
                <i className="fa-solid fa-xmark fa-lg"></i> {registerError}
              </p>
            )}
            {loading && <Loader />}
            <Button text="Registrarse" type="submit" />
            <p className="text-gray-500">
              ¿Ya tenés una cuenta?{" "}
              <Link to="/login" className="underline">
                Iniciá sesión
              </Link>
            </p>
          </form>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default Register;
