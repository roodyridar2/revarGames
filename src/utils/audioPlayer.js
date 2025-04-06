// let audioDice;
// export const playSound = async (mySound) => {
//  audioDice= new Audio(mySound);
//   try {
//     await audioDice.play(); // Wait for the sound to play
//   } catch (error) {
//     console.error("Error playing sound:", error); // Handle the error
//   }
// };

let audioPiece;

export const playSound = async (mySound) => {
  // get volume from local storage
  const volume = parseFloat(localStorage.getItem("volumeForClick"));
  audioPiece = new Audio(mySound);
  audioPiece.volume = isNaN(volume) ? 0.5 : volume; // Set the volume

  try {
    await audioPiece.play(); // Wait for the sound to play
  } catch (error) {
    console.error("Error playing sound:", error); // Handle the error
  }
};

let audio; // Global or external variable to keep track of the audio instance

export const playSoundForBg = (mySound) => {
  if (!audio) {
    audio = new Audio(mySound);
  }

  return {
    play: async () => {
      try {
        await audio.play();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    },
    stop: () => {
      audio.pause();
      audio.currentTime = 0; // Reset the audio to the beginning
    },
    setVolume: (volume) => {
      audio.volume = Math.max(0, Math.min(volume, 1)); // Ensure volume is between 0 and 1
    },
  };
};
