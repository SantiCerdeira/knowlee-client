import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";

const usePost = (postId) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/post/${postId}`, {
          credentials: 'include'
        });

        const postData = await response.json();

        setPost(postData);
      } catch (error) {
        console.error("Error al cargar la publiación:", error);
      }
    };

    fetchPost();
  }, [postId]);

  return { post };
};

export default usePost;
