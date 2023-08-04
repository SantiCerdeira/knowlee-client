import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";

const useGroupPost = (postId) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchGroupPost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/group-post/${postId}`, {
          credentials: 'include'
        });

        const postData = await response.json();

        setPost(postData);
      } catch (error) {
        console.error("Error al cargar la publiación:", error);
      }
    };

    fetchGroupPost();
  }, [postId]);

  return { post };
};

export default useGroupPost;
