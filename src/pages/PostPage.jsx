import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { getUserId } from "../utils/users/getUserId";
import Post from "../components/Post";
import { formatPostDate } from "../utils/helpers/formatPostDate";
import { getAuthenticatedUser } from "../utils/users/getAuthenticateUser.js";
import Loader from "../components/Loader";
import Feedback from "../components/Feedback";
import { BASE_URL } from "../utils/helpers/config.js";
import usePost from "../utils/posts/usePost.js";
import useAuthentication from "../utils/helpers/useAuthentication.js";

function PostPage() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [comments, setComments] = useState("");
  const { postId } = useParams();
  const { post } = usePost(postId);
  const navigate = useNavigate();

  useAuthentication();

  useEffect(() => {
    getUserId().then((result) => setUserId(result));
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser();
      setUser(user);
    };
    fetchUserData();
  }, [userId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get-comments/${postId}`, {
        credentials: 'include',
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

  if (!post) {
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
      <section className="w-full lg:w-[75vw] xl:w-[60vw] min-h-screen bg-[#c1d0f3] mx-auto py-7 px-5">
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
          {user && post && (
            <Post
              postId={post._id}
              premium={post.premium}
              key={post._id}
              name={post.author.name}
              lastName={post.author.lastName}
              userName={post.author.userName}
              img={post.author.profileImage}
              author={post.author._id}
              authorPremium={post.author.premium}
              title={post.title}
              text={post.content}
              date={formatPostDate(post.date)}
              likes={post.likes}
              comments={comments}
              file={post.fileName}
              ratings={post.ratings}
              showCommentsForm={true}
              postPage={true}
              fetchComments={fetchComments}
              onDelete={handlePostDelete}
              user={user}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default PostPage;
