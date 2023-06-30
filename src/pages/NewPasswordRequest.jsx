import React, { useState } from "react";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { BASE_URL } from "../utils/config.js";

const NewPasswordRequest = () => {
  const [values, setValues] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [reqError, setReqError] = useState("");

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

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setReqError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/reset-password/${values.email}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
       
        const { message } = await response.json();
        setReqError(message);
        setLoading(false);

      setValues({
        email: "",
      });

      navigate("/login");
    } catch (error) {
        setReqError(
        "Error al enviar el correo. Por favor, intentá nuevamente."
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
        <div className="bg-white rounded-lg border-solid border-2 border-blue-600 w-[50vw] mx-auto py-10 shadow-lg mb-20">
          <i className="fa-solid fa-user fa-2xl my-5"></i>
          <h3 className="text-center font-bold text-3xl">Solicitar cambio de contraseña</h3>
          <p className="text-center w-[75%] mx-auto text-gray-500 my-3">Si olvidaste tu contraseña, ingresá tu email y te vamos a enviar los pasos a seguir para poder cambiarla.</p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-around items-center py-5 w-8/12 mx-auto"
          >
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
            {reqError && (
              <p className="text-start  text-red-700 rounded-lg p-1">
                <i className="fa-solid fa-xmark fa-lg"></i> {reqError}
              </p>
            )}
            {loading && <Loader />}
            <Button text="Confirmar" type="submit" />
          </form>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default NewPasswordRequest;
