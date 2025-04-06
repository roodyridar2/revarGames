import axios from "axios";

const API_URL = import.meta.env.VITE_GAMES_API;

const getCustomerHighScore = async (userId) => {
  try {
    console.log(userId + " userId");
    const response = await axios.get(
      `${API_URL}/api/scores/doodleJump?customerId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export default getCustomerHighScore;
