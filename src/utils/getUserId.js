import { BASE_URL } from './config';

export const getUserId = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/user-id`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      const data = await response.json();
      return data.userId;
    } catch (error) {
      console.error(error);
      return false;
    }
  };