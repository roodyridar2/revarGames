import axios from 'axios';
import firebaseFuncs from '../../firebase/firebaseConfig'

let token;
export function setToken(t) {
  token = t;
}

export function getToken() {
  return token;
}

const API_URL = import.meta.env.VITE_GAMES_API;

const authenticateToken = async (token) => {
  try {
    const data = await axios
      .get(`${API_URL}/api/auth/token?token=${token}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setToken(response.data.token);
        return response.data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if (!data) {
      return { authenticated: false };
    }
    
    firebaseFuncs.logUserIdToFirebase(data.userId);

    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export default authenticateToken;
