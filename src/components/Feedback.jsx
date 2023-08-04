import React, { useEffect } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function Feedback({ message, status, setMessage, setStatus }) {
  useEffect(() => {
    if (message && status) {
      Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "bottom",
        style: {
          background: status === "success" ? "#4b96e9" : "#f15056",
          color: "white",
          fontWeight: "bold",
        },
        stopOnFocus: true,
        className: "text-black",
      }).showToast();
    }
  }, [message, status, setMessage, setStatus]);

  return <></>;
}

export default Feedback;
