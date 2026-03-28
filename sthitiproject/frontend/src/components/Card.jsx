import { useState } from "react";

const Card = ({ number,flipped, onClick }) => {
    // const [isFlipped, setisFlipped] = useState(false);

    return(
        <div className="card"  onClick={onClick}>

            <div className={`card-inner ${flipped ? "flipped" : ""}`}>
                <div className="card-front">?
                </div>
                <div className="card-back">
                    <span>{number}</span>
                </div>

            </div>

        </div>
    );
};

export default Card