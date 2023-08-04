import { useEffect, useState } from "react";
import { BASE_URL } from "../helpers/config.js";

const useGroups = (newGroup) => {
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      setGroupsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/groups`, {
          credentials: 'include'
        });
        const data = await response.json();
        setGroupsLoading(false);
        setGroups(data);
      } catch (error) {
        setGroupsLoading(false);
        console.log(error);
      }
    };

    fetchGroups();
  }, [newGroup]);

  return { groups, groupsLoading };
};

export default useGroups;
