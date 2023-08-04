import React from "react";
import { Link } from "react-router-dom";

const UsersModal = ({ closeModal, users }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-10">
      <div className="bg-white rounded-lg shadow-lg p-4 w-[70vw] h-[70vh] overflow-scroll">
        <button
          className="bg-black text-white font-semibold px-4 py-2 rounded-lg ml-0"
          onClick={closeModal}
        >
          <i className="fa-solid fa-xmark fa-lg"></i>
        </button>
        {users.length === 0 && (
          <p className="text-black font-semibold text-center text-2xl my-5">
            No hay usuarios.
          </p>
        )}
        {users.map((user) => (
          <article
            className="w-full mx-auto rounded-lg bg-white py-3 px-10 my-4"
            key={user._id}
          >
            <Link to={`/usuarios/${user._id}`}>
              <div className="flex items-center gap-3">
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-32 h-32 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {user.name} {user.lastName}
                  </h3>
                  <p className="text-gray-500">@{user.userName}</p>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default UsersModal;
