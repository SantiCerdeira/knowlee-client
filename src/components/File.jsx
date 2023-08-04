import React from "react";
import { Link } from "react-router-dom";

const Archivo = ({
  premium,
  averageRating,
  postRatings,
  text,
  className,
  onClick,
  link,
}) => {
  const ParentTag = link ? Link : "div";

  return (
    <ParentTag
      to={link}
      className={`w-10/12 my-2 rounded-lg shadow-md text-center p-3 text-white font-semibold flex flex-col xl:flex-row items-center justify-center gap-4 ${
        premium ? "premium-flag" : ""
      } ${className}`}
      onClick={onClick}
    >
      <p>{text}</p>
      <div className="flex items-center gap-1">
        <p>{averageRating}</p>
        <i className="fa-solid fa-star fa-lg"></i>
        <p>({postRatings})</p>
      </div>
    </ParentTag>
  );
};

export default Archivo;
