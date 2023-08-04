import { getUserId } from "./getUserId";
import { BASE_URL } from "../helpers/config.js";

export const getAuthenticatedUser = async () => {
  const authUserId = await getUserId();
  if (!authUserId) {
    return false;
  }
  try {
    const response = await fetch(
      `${BASE_URL}/users/authenticated/${authUserId}`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
