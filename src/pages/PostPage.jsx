import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { getUserId } from "../utils/getUserId";
import Post from "../components/Post";
import { formatPostDate } from "../utils/formatPostDate";
import { getAuthenticatedUser } from "../utils/getAuthenticateUser";
import Loader from "../components/Loader";
import Feedback from "../components/Feedback";
import { BASE_URL } from "../utils/config.js";
import { AuthContext } from "../contexts/AuthContext";

function PostPage() {
  const [userId, setUserId] = useState("");
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [comments, setComments] = useState("");
  const { postId } = useParams();
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
    getUserId(token).then((result) => setUserId(result));
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser(token);
      setUser(user);
    };
    fetchUserData();
  }, [userId, token]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/post/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const postData = await response.json();

        setPost(postData);
      } catch (error) {
        console.error("Error al cargar la publiación:", error);
      }
    };

    fetchPost();
  }, [postId, token]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get-comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const commentsData = await response.json();

      setComments(commentsData);
    } catch (error) {
      console.error("Error al cargar los comentarios:", error);
    }
  };

  const handlePostDelete = (response) => {
    setMessage(response.message);
    setStatus(response.status);
    navigate("/perfil");
  };

  return (
    <div>
      <Navbar />
      <section className="w-full lg:w-[60vw] min-h-screen bg-blue-500 mx-auto py-7">
        <div className="flex flex-col gap-7 w-full lg:w-[100%] mx-auto">
          {message && (
            <Feedback
              message={message}
              status={status}
              setMessage={setMessage}
              setStatus={setStatus}
            />
          )}
          {!post && <Loader />}
          {post && (
            <Post
              name={post.author.name}
              lastName={post.author.lastName}
              userName={post.author.userName}
              img={post.author.profileImage}
              text={post.content}
              title={post.title}
              file={post.fileName}
              date={formatPostDate(post.date)}
              likes={post.likes}
              ratings={post.ratings}
              key={post._id}
              postId={post._id}
              author={post.author._id}
              authorPremium={post.author.premium}
              premium={post.premium}
              user={user}
              comments={comments}
              onDelete={handlePostDelete}
              fetchComments={fetchComments}
              showCommentsForm={true}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default PostPage;
