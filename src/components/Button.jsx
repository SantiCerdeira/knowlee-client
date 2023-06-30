import React from "react";

const Button = ({ text, type, onClick, className }) => {
  return (
    <button
      className={`bg-gradient-to-t from-blue-500 to-blue-600 text-white font-semibold p-3 rounded-lg my-5 mx-auto w-2/4 hover:scale-105 transition duration-200 drop-shadow-xl ${className}}`}
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
