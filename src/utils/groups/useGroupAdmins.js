import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";

const useGroupAdmins = (groupId) => {
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

  useEffect(() => {
    const fetchGroupAdmins = async () => {
      setAdminsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/group/${groupId}/admins`, {
          credentials: 'include'
        });
        const data = await response.json();
        setAdmins(data);
        setAdminsLoading(false);
      } catch (error) {
        console.log(error);
        setAdminsLoading(false);
      }
    };

    fetchGroupAdmins();
  }, [groupId]);

  return { admins, adminsLoading };
};

export default useGroupAdmins;
