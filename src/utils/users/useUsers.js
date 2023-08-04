import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";

const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`, {
          credentials: 'include'
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  return { users };
};

export default useUsers;
