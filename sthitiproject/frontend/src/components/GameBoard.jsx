import {  useEffect, useState } from "react";
import Card from "./Card";
import { shuffleArray } from "../utils/shuffle";
const GameBoard = ({bet, balance,setBalance}) => {
    // const row1 = [23,45,67,98,90];
    // const row2 = [23,98,23,90,45];
    const[row1, setRow1] = useState([]);
    const[row2, setRow2] = useState([]);
    const[selected, setSelected] = useState([]);
    const[matched, setMatched] = useState([]);

    const token = localStorage.getItem("token");

 useEffect(() => {
    const nums = [23,45,67,98,90];

    const cards = nums.map((num,i) => ({
        id: i,
        value: num,
    }));
    setRow1(cards);
    setRow2(shuffleArray(cards));
 },[]);

    const reshuffle = () =>{
        const shuffleRow = (row,rowNumber) => {
            const matchedIds = matched.filter((c) => c.row === rowNumber).map((c) => c.id);

            const unlocked = row.filter((c) => !matchedIds.includes(c.id));

            const shuffled = shuffleArray(unlocked);

            let result =[];
            let j=0;

            for(let i=0; i<row.length;i++){
                if(matchedIds.includes(row[i].id)){
                    result.push(row[i]);
                }else{
                    result.push(shuffled[j]);
                    j++;
                }
            }

            return result;
        };

        setRow1((prev) => shuffleRow(prev,1));
        setRow2((prev) => shuffleRow(prev,2));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            reshuffle();
        },4000);

        return () => clearInterval(interval);
    },[matched]);

    // const[selected, setSelected] = useState([]);
    // const[matched, setMatched] = useState([]);

    const handleClick = (card, row, index) => {
        if(bet > 5000){
            alert("Max bet is 5000");
            return;
        }

        if(balance < bet){
            alert("Insufficient balance");
            return;
        }
        if(selected.length ===2) return;

        const newSelection = [...selected,{...card,row,index}];

        setSelected(newSelection);

        if(newSelection.length === 2){
            const[first, second] = newSelection;

            const isMatch = first.value === second.value && first.row !== second.row;

            if(isMatch){
                setMatched((prev) => [...prev, first, second]);
                            // setBalance((prev) => prev + bet * 3);
                            fetch("http://localhost:5000/api/wallet/add", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    amount: bet*3
                                })
                            })
                                .then ((res) => res.json())
                                .then((data) => {
                                    console.log("WIN:",data)
                                    setBalance(data.wallet);
                                })
                            

            }else{
                fetch("http://localhost:5000/api/wallet/deduct", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        amount: bet
                    })
                })
                    .then ((res) => res.json())
                    .then((data) => {
                        console.log("LOSE:",data)
                        setBalance(data.wallet);
                    
                });
            }

            

            setTimeout(() => {
                setSelected([]);
                if(!isMatch){
                reshuffle();
                }
            },800)
        }
    };

    
    const isFlipped = (row,index,card) => {
        return (
            selected.some((c) => c.row === row && c.index === index) || matched.some((c) => c.id === card.id)
        );
    };

    return (
        <div className="game-board">
            <div className="row">
                {row1.map((card,i) => (
                    <Card key={card.id} number={card.value} flipped={isFlipped(1,i,card)} onClick ={() => handleClick(card, 1, i)} />
                ))}
            </div>
            <div className="row">
                {row2.map((card,i) => (
                    <Card key={card.id} number={card.value} flipped={isFlipped(2,i,card)} onClick ={() => handleClick(card, 2, i)}/>
                ))}
            </div>
        </div>
    );
}
 export default GameBoard
