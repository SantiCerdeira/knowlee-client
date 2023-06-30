import { BASE_URL } from "./config.js";

export const isAuthenticated = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/isAuthenticated`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data.authenticated;
  } catch (error) {
    console.error(error);
    return false;
  }
};
