import "./Card.css";

const Card = ({ value, isFlipped, onClick }) => {
  return (
    <div
      className="card"
      onClick={!isFlipped ? onClick : undefined} // disable click if already flipped
    >
      <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
        
        {/* Front (hidden state) */}
        <div className="card-front">
          ?
        </div>

        {/* Back (revealed state) */}
        <div className="card-back">
          {value}
        </div>

      </div>
    </div>
  );
};

export default Card;