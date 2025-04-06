import axios from "axios";

const API_URL = import.meta.env.VITE_GAMES_API;

const payForGame = async ({token, modeId, appVersion}) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/modes/game-coins?modeId=${modeId}&appVersion=${appVersion}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    console.log("Payment response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const postNotEnoughCoins = () => {
  if (window.ReactNativeWebView) {
    const message = JSON.stringify({
      message: "not_enough_coins",
    });

    console.log("Sending message to ReactNativeWebView:", message);
    window.ReactNativeWebView.postMessage(message);
  }
};

export default payForGame;
