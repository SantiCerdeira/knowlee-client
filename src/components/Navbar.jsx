import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedUser } from "../utils/users/getAuthenticateUser.js";
import Loader from "./Loader";
import { AuthContext } from "../contexts/AuthContext";
import useNotReadNotifications from "../utils/notifications/useNotReadNotifications";

function Navbar() {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useContext(AuthContext);
  const { notifications } = useNotReadNotifications(
    user ? user._id : null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser();
      setUser(user);
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    setUser(null);
    logout(() => navigate("/login"));
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="py-7 bg-blue-600">
      {user ? (
        <>
          <div className="max-w-7xl mx-auto px-4 lg:px-6  flex justify-between items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-full"
                src="/img/logo-blanco.png"
                alt="Logo"
              />
            </div>
            <div className="flex-shrink-0 flex items-center gap-3 lg:gap-5">
              {user && (
                <>
                  <div className="hidden lg:flex items-center gap-3">
                    <Link
                      to="/inicio"
                      className="py-3 px-5 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200"
                    >
                      Inicio
                    </Link>
                    <Link
                      to="/grupos"
                      className="py-3 px-5 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200"
                    >
                      Grupos
                    </Link>
                    <Link
                      to="/chat"
                      className="py-3 px-5 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200"
                    >
                      Mensajes
                    </Link>
                    <Link
                      to="/perfil"
                      className="py-3 px-5 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 flex items-center gap-3"
                    >
                      <img
                        src={`${user.profileImage}`}
                        alt={user.name}
                        className="rounded-full w-12 shadow-md"
                      />
                      {user.name}
                    </Link>
                    <Link
                      to={`/notificaciones/${user._id}`}
                      className="relative py-3 px-3 text-white font-semibold text-lg rounded hover:scale-110 transition duration-200"
                    >
                      <i className="fa-solid fa-bell"></i>
                      <p className="absolute top-0 right-0 text-sm w-6 h-6 rounded-full p-1 bg-blue-400 text-white font-bold">
                        {notifications.length}
                      </p>
                    </Link>
                    <Link
                      to="/precios"
                      className="py-3 px-3 text-white font-semibold text-lg rounded hover:scale-110 transition duration-200"
                    >
                      <i className="fa-solid fa-dollar-sign"></i>
                    </Link>
                    <button
                      onClick={() => setShowLogout(!showLogout)}
                      className="py-3 px-3 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 flex items-center gap-3"
                    >
                      <i className="fa-solid fa-right-from-bracket fa-xl"></i>
                    </button>
                    {showLogout && (
                      <div className=" mt-2 bg-white rounded-lg shadow-lg border-4 border-solid border-blue-600">
                        <button
                          onClick={handleLogout}
                          className="block py-2 px-4 hover:bg-gray-300 text-start hover:rounded-lg"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="lg:hidden py-3 px-3 text-white font-semibold text-lg rounded hover:scale-105 transition duration-200 flex items-center gap-3"
                  >
                    <i className="fa-solid fa-bars fa-xl"></i>
                  </button>
                </>
              )}
            </div>
          </div>
          {showMenu && (
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
              <div className="flex flex-col gap-3 lg:hidden bg-blue-600 text-white rounded-lg shadow-lg my-5 font-semibold">
                <Link
                  to="/inicio"
                  className="block py-2 px-4 hover:bg-blue-500 text-start hover:rounded-lg"
                >
                  Inicio
                </Link>
                <Link
                  to="/grupos"
                  className="block py-2 px-4 hover:bg-blue-500 text-start hover:rounded-lg "
                >
                  Grupos
                </Link>
                <Link
                  to="/chat"
                  className="block py-2 px-4 hover:bg-blue-500 text-start hover:rounded-lg"
                >
                  Mensajes
                </Link>
                <Link
                  to="/perfil"
                  className="py-2 px-4 hover:bg-blue-500 text-start hover:rounded-lg flex  items-center gap-3"
                >
                  <img
                    src={`${user.profileImage}`}
                    alt={user.name}
                    className="rounded-full w-8 shadow-md"
                  />
                  {user.name}
                </Link>
                <Link
                  to={`/notificaciones/${user._id}`}
                  className="block py-2 px-4 hover:bg-blue-500 text-start hover:rounded-lg"
                >
                  <i className="fa-solid fa-bell"></i>
                  <p className="inline"> Notificaciones</p>
                  <p className="inline mx-2 text-sm w-8 h-8 rounded-full p-2 bg-blue-400 text-white font-bold">
                    {notifications.length}
                  </p>
                </Link>
                <Link
                  to="/precios"
                  className="block py-2 px-4 hover:bg-blue-500 text-start hover:rounded-lg"
                >
                  <i className="fa-solid fa-dollar-sign"></i>
                  <p className="inline"> Precios</p>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 px-4 bg-white text-blue-600 hover:bg-gray-300 rounded-lg text-start"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Loader className="w-100 h-100" />
      )}
    </nav>
  );
}

export default Navbar;
