import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Loader from "./Loader";
import { BASE_URL } from "../utils/helpers/config.js";

const ReportModal = ({ closeModal, userId, postId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [values, setValues] = useState({
    message: "",
  });

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!values.message) {
      setError("Ingresá un mensaje");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          message: values.message,
          userId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      closeModal();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-10">
      <div className="bg-white rounded-lg shadow-lg p-4 w-[70vw] h-fit overflow-scroll">
        <button
          className="bg-black text-white font-semibold px-4 py-2 rounded-lg ml-0"
          onClick={closeModal}
        >
          <i className="fa-solid fa-xmark fa-lg"></i>
        </button>
        <div className="p-5 ">
          <form onSubmit={handleSubmit}>
            <p className="text-black text-start text-xl font-semibold my-3 ">
              Ingresá los detalles tu reporte para que lo podamos revisar.
            </p>
            <Input
              type={"textarea"}
              placeholder={"Ingresá tu comentario"}
              value={values.message}
              onChange={handleChange("message")}
              name={"message"}
              id={"message"}
            />
            {error && (
              <p className="text-center  text-red-700 rounded-lg p-1">
                <i className="fa-solid fa-xmark fa-lg"></i> {error}
              </p>
            )}
            {loading && <Loader />}
            <Button text="Enviar" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
