import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import Feedback from "../components/Feedback";
import { formatPostDate } from "../utils/helpers/formatPostDate";
import { getAuthenticatedUser } from "../utils/users/getAuthenticateUser.js";
import Loader from "../components/Loader";
import useAuthentication from "../utils/helpers/useAuthentication.js";
import useUserFavoritePosts from "../utils/posts/useUserFavoritePosts";

function FavoritePosts() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const { postsLoading, userPosts } = useUserFavoritePosts("");

  useAuthentication();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser();
      setUser(user);
    };
    fetchUserData();
  }, []);

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
      <h1 className="text-black font-semibold text-3xl text-center my-5 ">
        Publicaciones guardadas en favoritos
      </h1>
      <section className="w-full lg:w-[60vw] min-h-screen bg-blue-400 p-5 mx-auto rounded-t-2xl">
        <div className="flex flex-col gap-7">
          {!postsLoading ? (
            <>
              {userPosts.length === 0 && (
                <p className="text-white text-3xl font-semibold text-center my-10">
                  No tenés ninguna publicación guardada
                </p>
              )}
              {userPosts.length > 0 &&
                userPosts.map((post) => {
                  return (
                    <Post
                      name={post.authorUser.name}
                      lastName={post.authorUser.lastName}
                      userName={post.authorUser.userName}
                      img={post.authorUser.profileImage}
                      text={post.content}
                      title={post.title}
                      file={post.fileName}
                      date={formatPostDate(post.date)}
                      likes={post.likes}
                      ratings={post.ratings}
                      comments={post.comments}
                      key={post._id}
                      postId={post._id}
                      author={post.author}
                      premium={post.premium}
                      authorPremium={post.authorUser.premium}
                      user={user}
                      showCommentsForm={false}
                    />
                  );
                })}
            </>
          ) : (
            <Loader />
          )}
        </div>
        {message && (
          <Feedback
            message={message}
            status={status}
            setMessage={setMessage}
            setStatus={setStatus}
          />
        )}
      </section>
    </div>
  );
}

export default FavoritePosts;
