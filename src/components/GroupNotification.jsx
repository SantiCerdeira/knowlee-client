import React, { useState} from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/helpers/config.js";
import { formatPostDate } from "../utils/helpers/formatPostDate.js";

function GroupNotification({ id, type, sender, reference, isRead, createdAt }) {
  const isFollowNotification = type === "follow";
  const [read, setRead] = useState(isRead);

  const handleMouseEnter = async () => {
    if (!isRead) {
      try {
        await fetch(`${BASE_URL}/group-notification/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include'
        });

        setRead(true);
      } catch (error) {
        console.error("Error leyendo la notificación:", error);
      }
    }
  };

  return (
    <div
      className={`flex items-center w-full group-flag shadow-md rounded-lg p-4 my-4 ${
        read ? "" : "border-solid border-2 border-blue-500"
      } hover:scale-105 transition duration-200`}
      key={id}
      onMouseEnter={handleMouseEnter}
    >
      <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0">
        <Link to={`/usuarios/${sender._id}`}>
          <img
            src={sender.profileImage}
            alt={sender.name}
            className="w-full h-full rounded-full cursor-pointer"
          />
        </Link>
      </div>
      <div className="ml-4 flex-grow">
        {isFollowNotification ? (
          <p className="text-base text-gray-600">
            {sender.name} comenzó a seguirte.
          </p>
        ) : (
          <>
            <p className="text-base text-gray-600">
              {sender.name} {getActionText(type)} tu publicación.
            </p>
            {reference && (
              <Link to={`/grupo/post/${reference._id}`}>
                <p className="my-1 text-base text-black font-semibold cursor-pointer">
                  "{reference.title}"
                </p>
              </Link>
            )}
          </>
        )}
        <p className="text-sm text-gray-400">{formatPostDate(createdAt)}</p>
      </div>
    </div>
  );
}

function getActionText(type) {
  switch (type) {
    case "like":
      return "dió me gusta en";
    case "comment":
      return "comentó";
    case "rating":
      return "valoró";
    default:
      return "interactuó con";
  }
}

export default GroupNotification;
