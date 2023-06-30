import { getUserId } from "./getUserId";
import { BASE_URL } from "./config";

export const getAuthenticatedUser = async (token) => {
    const authUserId = await getUserId(token);
    if (!authUserId) {
        return false;
    }
    try {
        const response = await fetch(`${BASE_URL}/users/authenticated/${authUserId}`, {
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