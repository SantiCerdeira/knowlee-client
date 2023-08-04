import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";
import { getUserId } from "../users/getUserId.js";

const useUserPosts = (newPost, userId = null) => {
  const [postsLoading, setPostsLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [fetchedUserId, setFetchedUserId] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setFetchedUserId(id);
    };

    if (!userId) {
      fetchUserId();
    }
  }, [userId]);

  const finalUserId = userId || fetchedUserId;

  useEffect(() => {
    const fetchUserPosts = async () => {
      setPostsLoading(true);

      try {
        const postsData = await fetchUserPostsData(finalUserId);
        const postsWithComments = await fetchPostComments(postsData);

        setPostsLoading(false);
        setUserPosts(postsWithComments);
      } catch (error) {
        setPostsLoading(false);
        console.error("Error al obtener las publicaciones del usuario:", error);
      }
    };

    if (finalUserId) {
      fetchUserPosts();
    }
  }, [newPost, finalUserId]);

  const fetchUserPostsData = async (userId) => {
    const response = await fetch(`${BASE_URL}/posts/${userId}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error("Error retrieving user posts");
    }
    const data = await response.json();
    return data;
  };

  const fetchPostComments = async (postsData) => {
    const postsWithComments = await Promise.all(
      postsData.map(async (post) => {
        const commentsResponse = await fetch(
          `${BASE_URL}/get-comments/${post._id}`,
          {
            credentials: 'include'
          }
        );
        const comments = await commentsResponse.json();

        return {
          ...post,
          comments,
        };
      })
    );

    return postsWithComments;
  };

  return { postsLoading, userPosts };
};

export default useUserPosts;
