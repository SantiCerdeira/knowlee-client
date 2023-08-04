import { BASE_URL } from "../helpers/config.js";

export const getUserId = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user-id`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.userId;
  } catch (error) {
    console.error(error);
    return false;
  }
};
