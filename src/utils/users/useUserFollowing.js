import { useEffect, useState, useCallback } from "react";
import { getUserId } from "../users/getUserId.js";
import { BASE_URL } from "../helpers/config.js";
import { getUserById } from "../users/getUserById.js";

const useUserFollowing = (userId) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const followersResponse = await fetch(`${BASE_URL}/${userId}/followers`, {
        credentials: 'include'
      });
      const data = await followersResponse.json();
      const followersData = await Promise.all(
        data.map(async (follower) => {
          const followerWithData = await getUserById(follower);

          return followerWithData;
        })
      );

      const followingResponse = await fetch(`${BASE_URL}/${userId}/following`, {
        credentials: 'include'
      });
      const dataFollowing = await followingResponse.json();
      const followingData = await Promise.all(
        dataFollowing.map(async (following) => {
          const followingWithData = await getUserById(following);

          return followingWithData;
        })
      );

      setFollowers(followersData);
      setFollowing(followingData);

      const authUserId = await getUserId();
      const follows = data.includes(authUserId);
      setIsFollowing(follows);
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const refetchUserData = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { followers, following, isFollowing, refetchUserData };
};

export default useUserFollowing;
