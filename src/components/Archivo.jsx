import React from "react";

const Archivo = ({
  premium,
  averageRating,
  postRatings,
  text,
  className,
  onClick,
}) => {
  return (
    <div
      className={`w-10/12 my-2 rounded-lg shadow-md text-center p-3 text-white font-semibold flex flex-col xl:flex-row items-center justify-center gap-4 ${
        premium ? "premium-flag" : ""
      } ${className}`}
      onClick={onClick}
    >
      <p className="">{text}</p>
      <div className="flex items-center gap-1">
        <p className="">{averageRating}</p>
        <i className="fa-solid fa-star fa-lg"></i>
        <p className="">({postRatings})</p>
      </div>
    </div>
  );
};

export default Archivo;
