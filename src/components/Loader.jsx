import React from "react";

const Loader = ({ className }) => {
  return (
    <div className={`loader my-8 ${className}`}>
      <div className="loader__spinner"></div>
    </div>
  );
};

export default Loader;
