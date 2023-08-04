import React from "react";

const Label = ({ text, htmlFor, className }) => {
  return (
    <label
      className={`block text-start font-bold text-xl ${className}`}
      htmlFor={htmlFor}
    >
      {text}
    </label>
  );
};

export default Label;
