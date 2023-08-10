import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { getUserId } from "../utils/users/getUserId";
import { formatPostDate } from "../utils/helpers/formatPostDate";
import { getAuthenticatedUser } from "../utils/users/getAuthenticateUser.js";
import Loader from "../components/Loader";
import Feedback from "../components/Feedback";
import { BASE_URL } from "../utils/helpers/config.js";
import useGroupPost from "../utils/groups/useGroupPost";
import useAuthentication from "../utils/helpers/useAuthentication.js";
import GroupPost from "../components/GroupPost";

function GroupPostPage() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [comments, setComments] = useState("");
  const { postId } = useParams();
  const { post } = useGroupPost(postId);
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
  }, [userId, ]);

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
    navigate("/grupos");
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
      <section className="w-full lg:w-[75vw] xl:w-[60vw] min-h-screen bg-[#c1d0f3] mx-auto py-7">
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
            <GroupPost
              postId={post._doc._id}
              premium={post._doc.premium}
              key={post._doc._id}
              name={post._doc.author.name}
              lastName={post._doc.author.lastName}
              userName={post._doc.author.userName}
              img={post._doc.author.profileImage}
              author={post._doc.author._id}
              authorPremium={post._doc.author.premium}
              title={post._doc.title}
              text={post._doc.content}
              date={formatPostDate(post._doc.date)}
              likes={post._doc.likes}
              comments={comments}
              file={post._doc.fileName}
              ratings={post._doc.ratings}
              showCommentsForm={true}
              fetchComments={fetchComments}
              onDelete={handlePostDelete}
              user={user}
              isAdmin={post.isAdmin}
              isMember={post.isMember}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default GroupPostPage;
