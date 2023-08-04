import { BASE_URL } from "../helpers/config.js";

export const getUserById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
