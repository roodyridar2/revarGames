/* eslint-disable react/prop-types */
function SingleCard({
  card,
  food_card_cover,
  handleChoice,
  flipped,
  disabled,
}) {
  function handleCard() {
    if (!disabled) handleChoice(card);
  }
  return (
    <div className="flex justify-center items-center p-2 bg-white rounded-2xl">
      <div className="mt-3 relative w-4/5">
        <img
          className={ flipped ? "rotateY-back-0 w-full rounded-lg" : "rotateY-back-90 w-full rounded-lg" }
          src={card.src}
          alt="food card"
        />
        <img
          className={ flipped ? "rotateY-front-90 w-full rounded-lg absolute top-0 left-0" : "rotateY-front-0 absolute top-0 left-0 w-full rounded-lg" }
          src={food_card_cover}
          onClick={handleCard}
          alt="cover card"
        />
      </div>
    </div>
  );
}

export default SingleCard;
