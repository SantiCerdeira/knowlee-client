import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";

const useGroup = (groupId) => {
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`${BASE_URL}/group/${groupId}`, {
          credentials: 'include'
        });

        const groupData = await response.json();

        setGroup(groupData);
      } catch (error) {
        console.error("Error al cargar el grupo:", error);
      }
    };

    fetchGroup();
  }, [groupId]);

  return { group };
};

export default useGroup;
