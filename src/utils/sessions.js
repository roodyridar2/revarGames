import axios from 'axios';

const API_URL = import.meta.env.VITE_GAMES_API;

const addSessionToDB = async (session, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/records/session-end`,
      { ...session, userAgent: navigator.userAgent },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export default addSessionToDB;
