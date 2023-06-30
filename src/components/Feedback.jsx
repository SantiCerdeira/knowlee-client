import React, { useEffect } from "react";

function Feedback({ message, status, setMessage, setStatus }) {
  useEffect(() => {
    let timeout;

    if (message) {
      timeout = setTimeout(() => {
        setMessage(null);
        setStatus(null);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [message, setMessage, setStatus]);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border-2 border-solid font-semibold fade-in transition-all duration-500 ${
        status === "success"
          ? "bg-white border-blue-700"
          : "bg-red-400 border-red-600"
      }`}
    >
      {message}
    </div>
  );
}

export default Feedback;
