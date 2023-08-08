import React, { useState, useEffect, useRef } from "react";
import { BASE_URL, SOCKET_URL } from "../utils/helpers/config.js";
import { getAuthenticatedUser } from "../utils/users/getAuthenticateUser.js";
import { getUserId } from "../utils/users/getUserId.js";
import Navbar from "../components/Navbar.jsx";
import { getUserById } from "../utils/users/getUserById.js";
import { formatPostDate } from "../utils/helpers/formatPostDate.js";
import Loader from "../components/Loader.jsx";
import Button from "../components/Button.jsx";
import io from "socket.io-client";
import useUsers from "../utils/users/useUsers.js";
import useAuthentication from "../utils/helpers/useAuthentication.js";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [authUserId, setAuthUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [values, setValues] = useState({
    message: "",
  });
  const chatContainerRef = useRef(null);
  const { users } = useUsers();

  useAuthentication();

  useEffect(() => {
    const fetchAuthUserId = async () => {
      const userId = await getUserId();
      setAuthUserId(userId);
    };
    fetchAuthUserId();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthenticatedUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (message) => {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, message],
        }));
      });
    }
  }, [socket]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    setShowUserList(false);
  }, [selectedChat]);

  const handleUserClick = async (userId) => {
    setChatLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/chats`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: [authUserId, userId],
        }),
      });

      const data = await response.json();
      setSelectedChat(data);
      const newSelectedUser = await getUserById(userId);
      setSelectedUser(newSelectedUser);
      setChatLoading(false);
    } catch (error) {
      setChatLoading(false);
      console.log(error);
    }
  };

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (values.message === "") return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/${selectedChat._id}/message`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            content: values.message,
            sender: authUserId,
            createdAt: new Date(),
          },
        }),
      });

      const data = await response.json();

      socket.emit("message", data.newMessage);
      setValues({ message: "" });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="">
      <Navbar />
      <div className="w-full h-[85vh] flex flex-col lg:flex-row justify-center gap-3">
        {showUserList && (
          <div className="relative bg-blue-500  p-5 lg:hidden">
            <h2 className="text-white text-lg font-bold mb-4">Usuarios</h2>
            <div className="absolute top-3 right-3 lg:hidden">
              <button
                className="bg-blue-400 text-white py-2 px-4 rounded-lg shadow-lg"
                onClick={() => setShowUserList(!showUserList)}
              >
                Cerrar
              </button>
            </div>
            <ul>
              {users
                .filter((user) => user._id !== authUserId)
                .map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className={`cursor-pointer bg-white text-black p-2 rounded-md shadow-lg hover:bg-gray-300 transition duration-200 font-semibold mb-3 flex items-center ${
                      selectedUser?._id === user._id &&
                      "border-2 border-gray-700 scale-[0.98]"
                    }`}
                  >
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{user.name}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div className="bg-blue-500 p-5 lg:w-1/4 hidden lg:inline-block">
          <h2 className="text-white text-lg font-bold mb-4">Usuarios</h2>
          <ul>
            {users
              .filter((user) => user._id !== authUserId)
              .map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className={`cursor-pointer bg-white text-black p-2 rounded-md shadow-lg hover:bg-gray-300 transition duration-200 font-semibold mb-3 flex items-center ${
                    selectedUser?._id === user._id &&
                    "border-2 border-gray-700 scale-[0.98]"
                  }`}
                >
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{user.name}</span>
                </li>
              ))}
          </ul>
        </div>
        <div className="bg-white p-5 lg:w-3/4 h-full">
          <div className="flex flex-col justify-between h-full">
            <div className="h-5/6">
              <h2 className="text-lg font-bold mb-2">Chat</h2>
              {!showUserList && (
                <div className="lg:hidden mb-3">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg"
                    onClick={() => setShowUserList(!showUserList)}
                  >
                    Usuarios
                  </button>
                </div>
              )}
              {chatLoading && <Loader />}
              {selectedChat && selectedUser ? (
                <div
                  className="customHeight max-w-full lg:max-w-[90%] mx-auto overflow-y-scroll"
                  ref={chatContainerRef}
                >
                  {selectedChat.messages.length === 0 && (
                    <p className="text-center text-gray-600 my-2">
                      No hay mensajes
                    </p>
                  )}
                  {selectedChat.messages.length !== 0 &&
                    selectedChat.messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex items-center gap-2 mb-2 ${
                          message.sender === user._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-center max-w-[85%] lg:max-w-[45%] gap-2 ${
                            message.sender === user._id
                              ? ""
                              : "flex-row-reverse"
                          }`}
                        >
                          <div
                            className={`text-start py-2 px-4 rounded-lg shadow-md ${
                              message.sender === user._id
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <p
                              className={`${
                                message.sender === user._id
                                  ? "text-white"
                                  : "text-gray-700"
                              }`}
                            >
                              {message.content}
                            </p>
                            <p
                              className={`text-xs opacity-75 my-1 ${
                                message.sender === user._id
                                  ? "text-white"
                                  : "text-gray-400"
                              }`}
                            >
                              {formatPostDate(message.createdAt)}
                            </p>
                          </div>
                          {message.sender && (
                            <img
                              src={
                                message.sender === user._id
                                  ? user.profileImage
                                  : selectedUser.profileImage
                              }
                              alt={
                                message.sender === user._id
                                  ? user.name
                                  : selectedUser.name
                              }
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div>Seleccioná algún usuario para comenzar a chatear</div>
              )}
            </div>
            <form
              className="flex items-stretch justify-between bg-white"
              onSubmit={sendMessage}
            >
              <input
                type="text"
                placeholder="Escribí tu mensaje..."
                name="message"
                id="message"
                value={values.message}
                className="border border-gray-300 rounded px-3 py-2 w-full mr-2"
                onChange={handleChange("message")}
                autoComplete="off"
              />
              {loading ? (
                <Loader />
              ) : (
                <Button
                  text={<i className="fa-solid fa-paper-plane fa-lg"></i>}
                  type="submit"
                  className="w-[15%] z-0 h-full"
                />
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
