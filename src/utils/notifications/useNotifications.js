import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";

const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotificationsLoading(true);
      try {
        const [userNotificationsResponse, groupNotificationsResponse] =
          await Promise.all([
            fetch(`${BASE_URL}/notifications/${userId}`, {
               credentials: 'include'
            }),
            fetch(`${BASE_URL}/group-notifications/${userId}`, {
               credentials: 'include'
            }),
          ]);

        const userNotificationsData = await userNotificationsResponse.json();
        const groupNotificationsData = await groupNotificationsResponse.json();

        const userNotificationsWithType = userNotificationsData.map(
          (notification) => ({
            ...notification,
            origin: "normal",
          })
        );

        const groupNotificationsWithType = groupNotificationsData.map(
          (notification) => ({
            ...notification,
            origin: "group",
          })
        );

        const allNotifications = [
          ...userNotificationsWithType,
          ...groupNotificationsWithType,
        ];

        const sortedNotifications = allNotifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(sortedNotifications);
        setNotificationsLoading(false);
      } catch (error) {
        console.log(error);
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  return { notifications, notificationsLoading };
};

export default useNotifications;
