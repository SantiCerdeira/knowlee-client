export const formatPostDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear().toString().slice(-2); 
    const hour = date.getHours().toString().padStart(2, '0'); 
    const minute = date.getMinutes().toString().padStart(2, '0');
  
    const formattedDate = `${day}/${month}/${year}, ${hour}:${minute}`;
    return formattedDate;
  };
