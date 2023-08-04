import React, { useState } from "react";
import { BASE_URL } from "../utils/helpers/config.js";

const Comment = ({
  name,
  lastName,
  img,
  text,
  title,
  date,
  onDelete,
  commentId,
  author,
  user,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/comment/${commentId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      const data = await response.json();
      setShowConfirmation(false);
      onDelete(data);
    } catch (error) {
      return console.log(error);
    }
  };

  return (
    <article className="w-10/12 mx-auto my-2 py-3 px-2 border-solid border-b-2 bg-gray-100 border-gray-300 rounded-t-xl">
      <div>
        <div className="flex justify-between">
          <div className="flex pt-2 px-1">
            <img
              src={`${img}`}
              alt={name}
              className="rounded-full w-14 shadow-md"
            />
            <div className="flex flex-col items-start">
              <h3 className="font-semibold my-auto mx-3">
                {name} {lastName}
              </h3>
              <p className="mx-3 text-sm text-gray-500">{date}</p>
            </div>
          </div>
          {user._id === author._id && (
            <button
              onClick={handleDeleteClick}
              className="text-blue-600 border-2 border-solid border-blue-600 bg-white rounded-lg p-5 w-10 h-10 flex justify-center items-center ml-3 hover:scale-105 focus:scale-105 transition duration-200"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          )}
        </div>
        <h4 className="text-start font-bold my-2 text-2xl px-8">{title}</h4>
        <p className="text-start py-3 px-8 text-gray-700">{text}</p>
        {showConfirmation && (
          <div>
            <p className="my-3 text-center font-semibold">
              ¿Estás seguro/a de que querés eliminar este comentario?
            </p>
            <div className="d-flex gap-5">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 px-4 py-2 text-white font-semibold rounded-lg mx-5 hover:bg-red-400"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-blue-600 px-4 py-2 text-white font-semibold rounded-lg mx-5 hover:bg-blue-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default Comment;
