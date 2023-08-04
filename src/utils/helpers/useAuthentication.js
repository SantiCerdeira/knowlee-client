import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "./auth.js";

const useAuthentication = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const result = await isAuthenticated();
      if (!result) {
        navigate("/login");
      }
    };

    checkAuthentication();
  }, [navigate]);
};

export default useAuthentication;
