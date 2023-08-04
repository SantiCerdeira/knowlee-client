import React, { useState } from "react";
import useAuthentication from "../utils/helpers/useAuthentication.js";
import Loader from "../components/Loader.jsx";
import Navbar from "../components/Navbar.jsx";
import Feedback from "../components/Feedback.jsx";
import useNotifications from "../utils/notifications/useNotifications.js";
import Notification from "../components/Notification.jsx";
import GroupNotification from "../components/GroupNotification.jsx";
import { useParams } from "react-router-dom";

function Notifications() {
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const { userId } = useParams();
  const { notifications, notificationsLoading } = useNotifications(
    userId
  );

  useAuthentication();

  return (
    <div>
      <Navbar />
      <section className="w-full lg:w-[60vw] bg-white pb-5 mx-auto py-5 px-5">
        {notificationsLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-wrap justify-around gap-2 mt-5">
            {notifications.length === 0 && (
              <p className="text-black font-semibold text-3xl text-center my-10">
                No tenés notificaciones
              </p>
            )}
            {notifications.map((notification) =>
              notification.group ? (
                <GroupNotification
                  id={notification._id}
                  key={notification._id}
                  type={notification.type}
                  sender={notification.sender}
                  receiver={notification.receiver}
                  reference={notification.reference}
                  isRead={notification.isRead}
                  createdAt={notification.createdAt}
                />
              ) : (
                <Notification
                  id={notification._id}
                  key={notification._id}
                  type={notification.type}
                  sender={notification.sender}
                  receiver={notification.receiver}
                  reference={notification.reference}
                  isRead={notification.isRead}
                  createdAt={notification.createdAt}
                />
              )
            )}
          </div>
        )}
        {message && (
          <Feedback
            message={message}
            status={status}
            setMessage={setMessage}
            setStatus={setStatus}
          />
        )}
      </section>
    </div>
  );
}

export default Notifications;
