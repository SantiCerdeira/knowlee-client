import { BASE_URL } from "../helpers/config.js";

export const isAuthenticated = async () => {
  try {
    const response = await fetch(`${BASE_URL}/isAuthenticated`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error(error);
    return false;
  }
};
