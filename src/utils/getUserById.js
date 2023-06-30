import { BASE_URL } from "./config.js";

export const getUserById = async (id, token) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
              },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return false;
    }
} 