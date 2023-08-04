import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";
import { getUserById } from "../users/getUserById.js";

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsResponse = await fetch(`${BASE_URL}/posts/`, {
          credentials: 'include'
        });
        const data = await postsResponse.json();

        const postWithData = await Promise.all(
          data.map(async (post) => {
            const authorUser = await getUserById(post.author);

            const commentsResponse = await fetch(
              `${BASE_URL}/get-comments/${post._id}`,
              {
                credentials: 'include'
              }
            );
            const comments = await commentsResponse.json();

            return {
              ...post,
              authorUser,
              comments,
            };
          })
        );

        setPosts(postWithData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading };
};

export default usePosts;
