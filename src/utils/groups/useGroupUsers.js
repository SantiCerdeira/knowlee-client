import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";

const useGroupUsers = (groupId, refetchUsers) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/group/${groupId}/members`, {
          credentials: 'include'
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroupUsers();
  }, [groupId, refetchUsers]);

  return { users };
};

export default useGroupUsers;
