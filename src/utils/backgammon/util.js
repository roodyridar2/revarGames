import { useState, useEffect } from "react";
// Function to check if all pieces are in the home board
const allPiecesInHome = (currentPlayer, board) => {
  let isPieceAtHome = true;
  console.log("currentPlayer: ", currentPlayer);

  if (currentPlayer === 1) {
    console.log("white");
    for (let i = 0; i < 18; i++) {
      if (board[i] > 0) {
        isPieceAtHome = false;
      }
    }

    return isPieceAtHome;
  } else {
    console.log("black");
    for (let i = 6; i < 24; i++) {
      if (board[i] < 0) {
        isPieceAtHome = false;
      }
    }
    console.log("isPieceAtHome: ", isPieceAtHome);
    return isPieceAtHome;
  }
};

export const calculatePossibleMoves = (
  from,
  movesLeft,
  currentPlayer,
  board
) => {
  //if user directly click on the remove bar
  if (from == 26 || from == 27) {
    return [];
  }
  const barIndex = currentPlayer === 1 ? 24 : 25;

  // Handle moves from the bar
  if (from === barIndex) {
    const moves = movesLeft
      .map((die) => {
        const to = currentPlayer === 1 ? die - 1 : 24 - die;
        if (
          to >= 0 &&
          to < 24 &&
          (board[to] * currentPlayer >= 0 || Math.abs(board[to]) === 1)
        ) {
          return to;
        }
        return null;
      })
      .filter((move) => move !== null);

    return moves;
  }

  if (allPiecesInHome(currentPlayer, board)) {
    let normalMoves = calculatePossibleNormalMoves(
      from,
      movesLeft,
      currentPlayer,
      board
    );
    console.log("calculatePossibleNormalMoves: ", normalMoves);

    movesLeft
      .map((die) => {
        //check for black piece
        if (currentPlayer === -1) {
          console.log("from: black");

          let temp = true;
          if (die === from + 1) {
            normalMoves = [...normalMoves, 27];
          }
          console.log("normalMoves: ", normalMoves);
          // check if the piece can be removed for black
          if (board[die - 1] >= 0) {
            if (from + 1 < die) {
              for (let i = from; i <= 5; i++) {
                if ((board[i + 1] <= -1)) {
                  // console.log("i: ", i);
                  // console.log(board[i + 1]);
                  temp = false;
                }
              }
            } else {
              console.log("test 2");
              temp = false;
            }

            if (temp) {
              normalMoves = [...normalMoves, 27];
            }
          }
          //check for white piece
        } else if (currentPlayer === 1) {
          let temp = true;
          if (die === 24 - from) {
            normalMoves = [...normalMoves, 26];
          }
          //check if the piece can be removed for white
          // if (board[24 - die - 1] === 0) {
          if (board[24 - die - 1] <= 0) {
            if (from > 24 - die - 1) {
              for (let i = from - 1; i >= 18; i--) {
                if (board[i - 1] >=1) {
                  temp = false;
                }
              }
            } else {
              temp = false;
            }

            if (temp) {
              normalMoves = [...normalMoves, 26];
            }
          }
        }
      })
      .filter((move) => move !== null);

    // console.log("from: ", from);
    // console.log("normalMoves: ", normalMoves);
    return normalMoves;
  }

  // Handle normal moves
  const moves = calculatePossibleNormalMoves(
    from,
    movesLeft,
    currentPlayer,
    board
  );

  return moves;
};

export const initialBoard = [
  2,
  0,
  0,
  0,
  0,
  -5,
  0,
  -3,
  0,
  0,
  0,
  5,
  -5,
  0,
  0,
  0,
  3,
  0,
  5,
  0,
  0,
  0,
  0,
  -2,
  0, // Bar for the white pieces
  0, // Bar for the black pieces
  0, // Removed white pieces
  0, // Removed black pieces
];

// export const initialBoard = [
//   2,
//   2,
//   2,
//   2,
//   0,
//   -5,
//   0,
//   -3,
//   0,
//   0,
//   1,
//   5,
//   -5,
//   0,
//   2,
//   0,
//   3,
//   1,
//   5,
//   2,
//   0,
//   -2,
//   2,
//   -2,
//   0, // Bar for the white pieces
//   0, // Bar for the black pieces
//   0, // Removed white pieces
//   0, // Removed black pieces
// ];

function calculatePossibleNormalMoves(from, movesLeft, currentPlayer, board) {
  //if there was only 4 dice
  let possibleMovesDestination = [];
  let possibleMoves = [];

  movesLeft.map((die) => {
    const to = currentPlayer === 1 ? from + die : from - die;
    if (
      to >= 0 &&
      to < 24 &&
      (board[to] * currentPlayer >= 0 || Math.abs(board[to]) === 1)
    ) {
      possibleMovesDestination = [...possibleMovesDestination, to];
    }
  });

  //turn possible move to destination move
  possibleMoves.map((die) => {
    const to = currentPlayer === 1 ? from + die : from - die;
    if (to >= 0 && to < 24) {
      possibleMovesDestination = [...possibleMovesDestination, to];
    }
  });

  return possibleMovesDestination;
}

export const useOrientation = () => {
  const [orientation, setOrientation] = useState(
    window.screen.orientation.type
  );

  const handleOrientationChange = () => {
    setOrientation(window.screen.orientation.type);
  };

  useEffect(() => {
    window.screen.orientation.addEventListener(
      "change",
      handleOrientationChange
    );
    return () => {
      window.screen.orientation.removeEventListener(
        "change",
        handleOrientationChange
      );
    };
  }, []);

  return "landscape-primary";
};
