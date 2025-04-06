import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SingleCard from "../../components/memory_game/SingleCard";
import "./MemoryGame.css";
import moment from "moment";


import card1 from "../../assets/img/memoryGame/donut.png";
import card2 from "../../assets/img/memoryGame/drink.png";
import card3 from "../../assets/img/memoryGame/fried-chicken.png";
import card4 from "../../assets/img/memoryGame/rice.png";
import card5 from "../../assets/img/memoryGame/salad.png";
import card6 from "../../assets/img/memoryGame/paneer.png";
import food_card_cover from "../../assets/img/memoryGame/memory-loss.png";

const food_cards = [
  { src: card1, matched: false },
  { src: card2, matched: false },
  { src: card3, matched: false },
  { src: card4, matched: false },
  { src: card5, matched: false },
  { src: card6, matched: false },
];



function MemoryGame() {

  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState(0);
  const [cardMatched, setCardMatched] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState(15);
  const [timeSpent, setTimeSpent] = useState(0);
  const [preview, setPreview] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameEndReason, setGameEndReason] = useState(""); 
  const [gameStarted, setGameStarted] = useState(false); // New state to track if game has started

  const navigate = useNavigate();

  const shuffle_cards = () => {
    const shuffledCards = [...food_cards, ...food_cards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurn(0);
    setTimer(15);
    setCardMatched(0);
    setDisabled(true);
    setPreview(true);
    setGameEnded(false);
    setGameEndReason("");
    setShow(false);

    setTimeout(() => {
      setDisabled(false);
      setPreview(false);
    }, 2000);
  };

  const handleChoice = (card) => {
    if (!disabled && !gameEnded) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCardMatched((matched) => matched + 1);
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Check for game completion when cards are matched
  useEffect(() => {
    if (cardMatched === food_cards.length && cardMatched > 0) {
      setGameEnded(true);
      setGameEndReason("You matched all cards!");
      setShow(true);
    }
  }, [cardMatched]);

  // Timer and game end on timeout
  useEffect(() => {
    let interval;
    if (timer > 0 && !show && !preview && !gameEnded) {
      interval = setInterval(() => {
        setTimeSpent((time) => time + 1);
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !gameEnded) {
      setGameEnded(true);
      setGameEndReason("Time's up!");
      setShow(true);
    }
    return () => clearInterval(interval);
  }, [timer, show, preview, gameEnded]);

  const handleRematch = () => {
    resetTurn();
    shuffle_cards();
    setShow(false);
    setTimeSpent(0);
    setGameStarted(true); // Ensure game remains in started state for rematch
  };

  // Remove auto-start effect, now game starts only when button is clicked

  function resetTurn() {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurn((prevTurn) => prevTurn + 1);
    setDisabled(false);
  }

  const handleClose = () => {
    setShow(false);
    setGameStarted(false); // Return to start screen instead of navigating away
  };

  const startGame = () => {
    setGameStarted(true);
    shuffle_cards();
  };

  return (
    <div className="bg-[#e43e43] h-screen w-screen flex justify-center items-center flex-col">
      {!gameStarted ? (
        // Start screen with play button
        <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#e43e43] mb-6">Memory Game</h1>
          <p className="text-gray-700 mb-6 text-center">Match all the cards before time runs out!</p>
          <button 
            className="bg-[#e43e43] text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-[#d83232] transition-colors"
            onClick={startGame}
          >
            Play Game
          </button>
        </div>
      ) : (
        // Game screen
        <div className="pb-20 flex justify-center items-center flex-col">
          <h2 className="bg-[#efefef] text-2xl text-[#e43e43] border border-gray-300 p-2 pl-3 pr-3 rounded-lg mb-8">
            {timer === 1 ? timer + " second" : timer + " seconds"}
          </h2>

          <div className="container mx-auto  flex-wrap grid grid-cols-3 gap-2  p-2">
            {cards.map((card) => (
              <SingleCard
                key={card.id}
                card={card}
                food_card_cover={food_card_cover}
                handleChoice={handleChoice}
                flipped={
                  preview ||
                  card === choiceOne ||
                  card === choiceTwo ||
                  card.matched ||
                  gameEnded
                }
                disabled={disabled || gameEnded}
              />
            ))}
          </div>
        <div
          className={`fixed inset-0 flex items-center justify-center ${
            show ? "" : "hidden"
          }`}
        >
          <div className="absolute inset-0 bg-gray/10  backdrop-blur flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="m-2 mb-4 font-bold text-2xl tracking-wider">
                {gameEndReason}
              </h2>
              <table className="table-auto w-full mb-4">
                <thead>
                  <tr>
                    <th className="border-b border-r px-4 py-2 text-left">
                      Turn
                    </th>
                    <th className="border-l border-b border-r px-4 py-2 text-left">
                      Card Matched
                    </th>
                    <th className="border-b border-l px-4 py-2 text-left">
                      Time Spent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-t border-r px-4 py-2 text-center">
                      {turn}
                    </td>
                    <td className="border-l border-t border-r px-4 py-2 text-center">
                      {cardMatched}
                    </td>
                    <td className="border-t border-l px-4 py-2 text-center">
                      {timeSpent}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="w-full bg-[#e43e43] text-white border-0 mb-2 py-2 rounded"
                onClick={handleRematch}
              >
                Rematch
              </button>
              <button
                className="w-full bg-gray-100 text-[#e43e43] border border-[#e43e43] font-bold py-2 rounded"
                onClick={handleClose}
              >
                Quit
              </button>
            </div>
          </div>
        </div>
        </div>
      )}
      
      {/* Game end popup - stays outside the conditional rendering for proper z-index layering */}
      <div
        className={`fixed inset-0 flex items-center justify-center ${
          show ? "" : "hidden"
        }`}
      >
        <div className="absolute inset-0 bg-gray/10  backdrop-blur flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="m-2 mb-4 font-bold text-2xl tracking-wider">
              {gameEndReason}
            </h2>
            <table className="table-auto w-full mb-4">
              <thead>
                <tr>
                  <th className="border-b border-r px-4 py-2 text-left">
                    Turn
                  </th>
                  <th className="border-l border-b border-r px-4 py-2 text-left">
                    Card Matched
                  </th>
                  <th className="border-b border-l px-4 py-2 text-left">
                    Time Spent
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t border-r px-4 py-2 text-center">
                    {turn}
                  </td>
                  <td className="border-l border-t border-r px-4 py-2 text-center">
                    {cardMatched}
                  </td>
                  <td className="border-t border-l px-4 py-2 text-center">
                    {timeSpent}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              className="w-full bg-[#e43e43] text-white border-0 mb-2 py-2 rounded"
              onClick={handleRematch}
            >
              Rematch
            </button>
            <button
              className="w-full bg-gray-100 text-[#e43e43] border border-[#e43e43] font-bold py-2 rounded"
              onClick={handleClose}
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoryGame;