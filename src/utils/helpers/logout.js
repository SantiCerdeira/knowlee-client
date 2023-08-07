// import { useContext } from "react";
// import { AuthContext } from "../../contexts/AuthContext";

// const Logout = ({ callback }) => {
//   const { logout } = useContext(AuthContext);

//   try {
//     logout(callback);
//   } catch (error) {
//     console.error("Error al cerrar sesión", error);
//   }
// };

// export default Logout;

import { BASE_URL } from "./config";

const logout = async (callback) => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include', 
    });
    if (response.status === 200) {
      console.log('Logged out successfully!');
      callback();
    } else {
      console.log('Logout failed.');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export default logout;
