import React, { useState, useEffect, useRef, useContext } from "react";
import { isAuthenticated } from "../utils/auth.js";
import { useNavigate } from "react-router-dom";
import { BASE_URL, SOCKET_URL } from "../utils/config.js";
import { getAuthenticatedUser } from "../utils/getAuthenticateUser.js";
import { getUserId } from "../utils/getUserId.js";
import Navbar from "../components/Navbar.jsx";
import { getUserById } from "../utils/getUserById.js";
import { formatPostDate } from "../utils/formatPostDate.js";
import Loader from "../components/Loader.jsx";
import Button from "../components/Button.jsx";
import io from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext.jsx";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [authUserId, setAuthUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [values, setValues] = useState({
    message: "",
  });
  const chatContainerRef = useRef(null);
  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const userAuthenticated = async () => {
      const result = await isAuthenticated(token);
      if (!result) navigate("/login");
    };

    userAuthenticated();
  }, [navigate, token]);

  useEffect(() => {
    const fetchAuthUserId = async () => {
      const userId = await getUserId(token);
      setAuthUserId(userId);
    };
    fetchAuthUserId();
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthenticatedUser(token);
      setUser(user);
    };
    fetchUser();
  }, [token]);

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
        console.log("New message received:", message);
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, message],
        }));
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [selectedChat]);

  const handleUserClick = async (userId) => {
    setChatLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/chats`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: [authUserId, userId],
        }),
      });

      const data = await response.json();
      setSelectedChat(data);
      const newSelectedUser = await getUserById(userId, token);
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
        headers: {
          Authorization: `Bearer ${token}`,
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
    <div className="min-h-screen">
      <Navbar />
      <div className="w-full flex justify-center gap-3">
        <div className="bg-blue-500 p-5 w-1/4 min-h-[90vh]">
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
        <div className="bg-white p-5 w-3/4 min-h-[90vh]">
          <div className="flex flex-col justify-between h-full">
            <div className="border-b-2 pb-4 mb-4">
              <h2 className="text-lg font-bold mb-2">Chat</h2>
              {chatLoading && <Loader />}
              {selectedChat && selectedUser ? (
                <div
                  className="h-[70vh] max-w-[90%] mx-auto overflow-y-scroll"
                  ref={chatContainerRef}
                >
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
                          className={`flex items-center max-w-[45%] gap-2 ${
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
              className="flex items-stretch justify-between"
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
              />
              <Button
                text={
                  loading ? (
                    <Loader className="my-0" />
                  ) : (
                    <i className="fa-solid fa-paper-plane fa-lg"></i>
                  )
                }
                type="submit"
                className="w-[15%] z-0 h-full"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
