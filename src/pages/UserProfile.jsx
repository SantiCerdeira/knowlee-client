import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { getUserId } from "../utils/users/getUserId";
import { useNavigate, useParams } from "react-router-dom";
import { formatPostDate } from "../utils/helpers/formatPostDate";
import Feedback from "../components/Feedback";
import Loader from "../components/Loader";
import { getUserById } from "../utils/users/getUserById";
import { BASE_URL } from "../utils/helpers/config.js";
import { fetchUserData } from "../utils/helpers/fetch.js";
import useUserPosts from "../utils/posts/useUserPost.js";
import useUserFollowing from "../utils/users/useUserFollowing.js";
import useAuthentication from "../utils/helpers/useAuthentication.js";
import UsersModal from "../components/UsersModal";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [authUserId, setAuthUserId] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const { userId } = useParams();
  const { postsLoading, userPosts } = useUserPosts("", userId);
  const { followers, following, isFollowing, refetchUserData } =
    useUserFollowing(userId);
  const [userIsFollowing, setUserIsFollowing] = useState(isFollowing);
  const [showModal, setShowModal] = useState(false);
  const [currentList, setCurrentList] = useState([]);

  const navigate = useNavigate();

  useAuthentication();

  useEffect(() => {
    getUserId().then((result) => {
      setAuthUserId(result);
      if (result === userId) navigate("/perfil");
    });
  }, [navigate, userId]);

  useEffect(() => {
    setUserIsFollowing(isFollowing);
  }, [isFollowing]);

  useEffect(() => {
    refetchUserData();
  }, [userIsFollowing, refetchUserData]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUserData();
      setUser(user);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfileUser = async () => {
      const profileUser = await getUserById(userId);
      setProfileUser(profileUser);
    };
    fetchProfileUser();
  }, [userId]);

  const handleFollow = async (authUserId, userId) => {
    const followerId = authUserId;
    const followingId = userId;

    try {
      const response = await fetch(`${BASE_URL}/follow`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId, followingId }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setUserIsFollowing((prevFollowing) => !prevFollowing);
      }
      setMessage(data.message);
      setStatus(data.status);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleUnfollow = async (authUserId, userId) => {
    const followerId = authUserId;
    const followingId = userId;

    try {
      const response = await fetch(`${BASE_URL}/unfollow`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ followerId, followingId }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setUserIsFollowing((prevFollowing) => !prevFollowing);
      }
      setMessage(data.message);
      setStatus(data.status);
    } catch (error) {
      return console.log(error);
    }
  };

  if (!user || !userPosts) {
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    );
  }

  const showUsersModal = (list) => {
    setCurrentList(list);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (showModal) {
    document.documentElement.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "auto";
  }

  return (
    <div>
      <Navbar />
      <section>
        <div className="w-[75vw] mx-auto flex flex-wrap shadow-lg p-5 rounded-b-3xl mb-4 gap-3">
          <div className="relative w-10/12 xl:w-4/12 flex justify-center  xl:justify-end items-center mx-auto xl:mr-5">
            <img
              src={`${profileUser.profileImage}`}
              className="relative rounded-full shadow-xl hover:scale-105 transition duration-300 w-[70%]"
              alt={profileUser.name + profileUser.lastName}
            />
          </div>
          <div className="w-full xl:w-7/12 flex flex-col justify-center text-center xl:text-start">
            <h1 className="font-bold text-2xl">
              {profileUser.name} {profileUser.lastName}
            </h1>
            <p className="text-md text-gray-400 mb-3">
              @{profileUser.userName}
            </p>
            <p className="text-lg lg:text-xl text-black text-center xl:text-start">
              {user.description}
            </p>
            <div className="flex gap-2 justify-center xl:justify-start">
              <p
                className="font-semibold text-md text-black mb-3 cursor-pointer"
                onClick={() => showUsersModal(followers)}
              >
                Seguidores: {followers.length} |
              </p>
              <p
                className="font-semibold text-md text-black mb-3 cursor-pointer"
                onClick={() => showUsersModal(following)}
              >
                Siguiendo: {following.length}
              </p>
            </div>
            {showModal && (
              <UsersModal closeModal={closeModal} users={currentList} />
            )}
            <div className="flex justify-center xl:justify-start gap-2 my-2">
              {profileUser.coffeeLink && (
                <a
                  href={profileUser.coffeeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/cafecito.png"
                    className="w-8 md:w-12 rounded-md shadow-lg inline hover:scale-105 transition duration-200"
                    alt="Cafecito"
                  />
                </a>
              )}
              {profileUser.paypalLink && (
                <a
                  href={profileUser.paypalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/paypal.png"
                    className="w-8 md:w-12 rounded-md shadow-lg inline hover:scale-105 transition duration-200"
                    alt="Paypal"
                  />
                </a>
              )}
              {profileUser.mercadoPagoLink && (
                <a
                  href={profileUser.mercadoPagoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/img/mercadopago.png"
                    className="w-8 md:w-12 rounded-md shadow-lg inline hover:scale-105 transition duration-200"
                    alt="MercadoPago"
                  />
                </a>
              )}
            </div>
            {userIsFollowing ? (
              <button
                className="w-7/12 lg:w-4/12 mx-auto bg-white rounded-lg text-blue-600 border-2 border-solid border-blue-400  shadow-md text-center p-3 font-semibold mb-3"
                onClick={() => handleUnfollow(authUserId, userId)}
              >
                <i className="fa-solid fa-user-check mx-3"></i> Siguiendo
              </button>
            ) : (
              <button
                className="w-7/12 lg:w-4/12 mx-auto bg-blue-500 text-white rounded-lg shadow-md text-center p-3 font-semibold mb-3"
                onClick={() => handleFollow(authUserId, userId)}
              >
                <i className="fa-solid fa-user-plus mx-3"></i> Seguir
              </button>
            )}
            {message && (
              <Feedback
                message={message}
                status={status}
                setMessage={setMessage}
                setStatus={setStatus}
              />
            )}
          </div>
        </div>

        <div className="w-full xl:w-[75vw] mx-auto flex flex-col gap-7 min-h-[70vh] shadow-lg p-5 rounded-t-3xl bg-[#c1d0f3]">
          {postsLoading && <Loader />}
          {!postsLoading && userPosts.length === 0 && (
            <p className="text-black font-semibold text-xl lg:text-3xl drop-shadow-xl my-7">
              Este usuario no ha realizado ninguna publicación
            </p>
          )}
          {userPosts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              premium={post.premium}
              name={profileUser.name}
              lastName={profileUser.lastName}
              userName={profileUser.userName}
              img={profileUser.profileImage}
              author={userId}
              authorPremium={profileUser.premium}
              title={post.title}
              text={post.content}
              date={formatPostDate(post.date)}
              likes={post.likes}
              comments={post.comments}
              file={post.fileName}
              ratings={post.ratings}
              user={user}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default UserProfile;
