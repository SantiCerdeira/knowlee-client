import React from "react";
import { Link } from "react-router-dom";

function Group({ id, name, image, members, isOwner }) {
  return (
    <Link
      to={`/grupo/${id}`}
      className={`w-11/12 lg:w-5/12 mx-auto my-3 shadow-md rounded-lg hover:scale-105 transition duration-200 ${
        isOwner ? "border-blue-500 border-2 border-solid" : ""
      }`}
      key={id}
    >
      <div className="h-40 relative">
        <img
          src={image}
          alt={name}
          className={`h-full w-full object-cover  ${
            isOwner ? "" : "rounded-t-lg"
          }`}
        />
      </div>
      <div className="h-auto flex flex-col justify-center bg-white p-3">
        <h3 className="text-black font-bold text-start text-base my-2">
          {name}{" "}
          {isOwner && (
            <span className="text-gray-500 font-bold text-sm text-start my-1">
              Admin
            </span>
          )}
        </h3>

        <p className="text-gray-400 text-sm text-start my-1">
          {members.length} Miembro(s)
        </p>
      </div>
    </Link>
  );
}

export default Group;
