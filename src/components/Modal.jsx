import React from "react";

const Modal = ({ closeModal, file, title, img, username }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-10">
      <div className="bg-white rounded-lg shadow-lg p-4 ">
        <div className="flex justify-between items-center py-3">
          <div className="flex gap-5 items-center">
            <img
              src={`${img}`}
              alt={username}
              className="rounded-full w-[4rem] shadow-md"
            />
            <h2 className="text-2xl font-semibold">{title}</h2>
          </div>
          <div className="flex gap-5 items-center">
            <a
              href={`${file}`}
              target="_blank"
              className="bg-black text-white font-semibold px-4 py-2 rounded-lg"
              rel="noopener noreferrer"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <button
              className="bg-black text-white font-semibold px-4 py-2 rounded-lg"
              onClick={closeModal}
            >
              <i className="fa-solid fa-xmark fa-lg"></i>
            </button>
          </div>
        </div>
        <div className="w-[80vw] h-[80vh] flex justify-center">
          <iframe
            title={file}
            src={`${file}`}
            className="w-full h-full shadow-2xl pdf"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Modal;
