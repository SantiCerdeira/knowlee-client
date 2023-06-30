import React from "react";

const Feature = ({ text, img, className }) => {
  return (
    <article
      className={`w-10/12 flex flex-col text-white justify-around items-center p-5 font-bold transition duration-200 neuBlue  ${className}`}
    >
      <img src={`img/${img}`} alt="" className="w-[10rem] lg:w-[15rem]" />
      <h5 className="text-center text-lg lg:text-xl xl:text-2xl my-5">
        {text}
      </h5>
    </article>
  );
};

export default Feature;
