import React, { useState } from "react";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { BASE_URL } from "../utils/helpers/config.js";

const NewPassword = () => {
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [reqError, setReqError] = useState("");
  const { token } = useParams();

  const navigate = useNavigate();

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

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

    if (values.password !== values.confirmPassword) {
      formErrors.password = "Las contraseñas no coinciden";
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
      const response = await fetch(`${BASE_URL}/cambiar-contrasena/${token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ password: values.password }),
      });

      const { message } = await response.json();

      if (!response.ok) {
        setReqError(message);
        setLoading(false);
        return;
      }

      setLoading(false);

      setValues({
        password: "",
        confirmPassword: "",
      });

      navigate("/login");
    } catch (error) {
      setReqError(
        "Error al cambiar la contraseña. Por favor, intentá nuevamente."
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
          src="/img/logo-final.png"
          alt="Logo Knowlee"
          className="w-56 mx-auto my-7"
        />
        <div className="bg-white rounded-lg border-solid border-2 border-blue-600 w-[95vw] lg:w-[75vw] xl:w-[50vw] mx-auto py-10 shadow-lg mb-20">
          <i className="fa-solid fa-user fa-2xl my-5"></i>
          <h1 className="text-center font-bold p-3 text-3xl">
            Establecer nueva contraseña
          </h1>
          <p className="text-center w-[75%] mx-auto text-gray-500 my-3">
            Ingresá y confirmá tu nueva contraseña.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-around items-center py-5 w-10/12 lg:w-8/12 mx-auto"
          >
            <div className="w-full my-1">
              <Label text="Contraseña:" htmlFor="password" />
              <Input
                type="password"
                placeholder="Ingresá la contraseña"
                value={values.password}
                onChange={handleChange("password")}
                name="password"
                id="password"
                aria-invalid={!!errors.password}
              />
              <p className="text-gray-400 text-sm text-start">
                La contraseña debe tener al menos 6 caracteres
              </p>
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
                placeholder="Ingresá la contraseña"
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

export default NewPassword;
