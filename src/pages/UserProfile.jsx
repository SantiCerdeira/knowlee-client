import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { getAuthenticatedUser } from "../utils/getAuthenticateUser";
import Post from "../components/Post";
import { getUserId } from "../utils/getUserId";
import { isAuthenticated } from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import { formatPostDate } from "../utils/formatPostDate";
import Feedback from "../components/Feedback";
import Loader from "../components/Loader";
import { getUserById } from "../utils/getUserById";
import { BASE_URL } from "../utils/config.js";
import { AuthContext } from "../contexts/AuthContext";

function UserProfile() {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [authUserId, setAuthUserId] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const { userId } = useParams();
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
    getUserId(token).then((result) => {
      setAuthUserId(result);
    });
  }, [token]);

  if (authUserId === userId) navigate("/perfil");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser(token);
      setUser(user);
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    const fetchProfileUser = async () => {
      const profileUser = await getUserById(userId, token);
      setProfileUser(profileUser);
    };
    fetchProfileUser();
  }, [userId, token]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${userId}/followers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        const followsTheUser = data.some((follower) => follower === authUserId);
        setFollowers(data);
        setFollowing(followsTheUser);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFollowers();
  }, [userId, authUserId, following, token]);

  useEffect(() => {
    const fetchUserFollowing = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${userId}/following`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserFollowing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserFollowing();
  }, [userId, token]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const posts = await fetch(`${BASE_URL}/posts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await posts.json();

        const postsWithData = await Promise.all(
          data.map(async (post) => {
            const commentsResponse = await fetch(
              `${BASE_URL}/get-comments/${post._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const comments = await commentsResponse.json();

            return {
              ...post,
              comments,
            };
          })
        );

        setUserPosts(postsWithData);
      } catch (error) {
        console.error("Error retrieving user posts:", error);
      }
    };

    fetchUserPosts();
  }, [userId, token]);

  useEffect(() => {
    console.log(followers);
  }, [followers]);

  const handleFollow = async (authUserId, userId) => {
    const followerId = authUserId;
    const followingId = userId;

    try {
      const response = await fetch(`${BASE_URL}/follow`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId, followingId }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setFollowing((prevFollowing) => !prevFollowing);
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ followerId, followingId }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setFollowing((prevFollowing) => !prevFollowing);
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
            <div className="flex gap-2">
              <p className="font-semibold text-md text-black mb-3">
                Seguidores: {followers.length} |
              </p>
              <p className="font-semibold text-md text-black mb-3">
                {" "}
                Siguiendo: {userFollowing.length}
              </p>
            </div>
            {following ? (
              <button
                className="bg-white rounded-lg text-blue-600 border-2 border-solid border-blue-400  shadow-md text-center p-3 font-semibold"
                onClick={() => handleUnfollow(authUserId, userId)}
              >
                <i className="fa-solid fa-user-check mx-3"></i> Siguiendo
              </button>
            ) : (
              <button
                className="bg-blue-600 text-white rounded-lg shadow-md text-center p-3 font-semibold"
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

        <div className="w-full xl:w-[75vw] mx-auto flex flex-col gap-7 min-h-[70vh] shadow-lg p-5 rounded-t-3xl bg-blue-500">
          {userPosts.length === 0 && (
            <p className="font-bold text-3xl my-7 text-white">
              Este usuario no ha realizado ninguna publicación
            </p>
          )}
          {userPosts.map((post) => (
            <Post
              name={profileUser.name}
              lastName={profileUser.lastName}
              userName={profileUser.userName}
              img={profileUser.profileImage}
              valoracion="4/5"
              cantidad="10"
              text={post.content}
              title={post.title}
              file={post.fileName}
              date={formatPostDate(post.date)}
              key={post._id}
              postId={post._id}
              likes={post.likes}
              ratings={post.ratings}
              comments={post.comments}
              author={userId}
              authorPremium={profileUser.premium}
              premium={post.premium}
              user={user}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default UserProfile;
