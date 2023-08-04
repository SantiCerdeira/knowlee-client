import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";

const useNotReadNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotReadNotifications = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${BASE_URL}/notifications/not-read/${userId}`,
            {
              credentials: 'include'
            }
          );
          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const fetchNotReadGroupNotifications = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${BASE_URL}/group-notifications/not-read/${userId}`,
            {
              credentials: 'include'
            }
          );
          const data = await response.json();
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...data,
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchNotReadNotifications();
    fetchNotReadGroupNotifications();
  }, [userId]);

  return { notifications };
};

export default useNotReadNotifications;
