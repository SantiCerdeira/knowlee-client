import { BASE_URL } from "../helpers/config.js";
import { getAuthenticatedUser } from "../users/getAuthenticateUser.js";
import { getUserById } from "../users/getUserById.js";

const fetchUserData = async () => {
  const user = await getAuthenticatedUser();
  return user;
};

const fetchFollowers = async (userId) => {
  if (!userId) {
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/${userId}/followers`, {
      credentials: 'include'
    });
    const data = await response.json();
    const followersData = await Promise.all(
      data.map(async (follower) => {
        const followerWithData = await getUserById(follower);

        return followerWithData;
      })
    );
    return followersData;
  } catch (error) {
    return [];
  }
};

const fetchUserFollowing = async (userId) => {
  if (!userId) {
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/${userId}/following`, {
      credentials: 'include'
    });
    const data = await response.json();
    const followingData = await Promise.all(
      data.map(async (following) => {
        const followingWithData = await getUserById(following);

        return followingWithData;
      })
    );
    return followingData;
  } catch (error) {
    return [];
  }
};

export { fetchFollowers, fetchUserFollowing, fetchUserData };
