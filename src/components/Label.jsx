import React from "react";

const Label = ({ text, htmlFor }) => {
  return (
    <label className="block text-start font-bold text-xl" htmlFor={htmlFor}>
      {text}
    </label>
  );
};

export default Label;
