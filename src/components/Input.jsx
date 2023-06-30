import React from "react";

const Input = ({
  type,
  placeholder,
  value,
  onChange,
  name,
  id,
  ariaInvalid,
}) => {
  return (
    <input
      className="w-full p-3 bg-[#f1f1f1] rounded-lg shadow-inner my-2"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      aria-invalid={ariaInvalid}
    />
  );
};

export default Input;
