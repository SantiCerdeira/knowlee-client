import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Logout = ({ callback }) => {
  const { logout } = useContext(AuthContext);

  try {
    logout(callback);
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  }
};

export default Logout;
