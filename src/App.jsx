/* eslint-disable react/prop-types */
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import MemoryGame from "./pages/ReactGame/MemoryGame.jsx";
import Hangmman from "./pages/ReactGame/Hangman.jsx";
import GameLauncher from "./components/GameLauncher.jsx";
import TicTacToe from "./pages/ReactGame/TicTacToe.jsx";
import GameWrapper from "./components/GameWrapper.jsx";
import RecipeAssembly from "./pages/ReactGame/RecipeAssembly.jsx";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <GameLauncher />,
    },
    {
      path: "/memory-game",
      element: (
        <GameWrapper gameName="Memory Game">
          <MemoryGame />
        </GameWrapper>
      ),
    },
    {
      path: "/hangman",
      element: (
        <GameWrapper gameName="Hangman">
          <Hangmman />
        </GameWrapper>
      ),
    },
    {
      path: "/ticTacToe",
      element: (
        <GameWrapper gameName="Tic Tac Toe">
          <TicTacToe />
        </GameWrapper>
      ),
    },
    {
      path: "/kurdish-recipe",
      element: (
        <GameWrapper gameName="Kurdish Recipe Assembly">
          <RecipeAssembly />
        </GameWrapper>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;