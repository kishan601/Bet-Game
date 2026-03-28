import { useState, useEffect } from "react";
import GameBoard from "../components/GameBoard";

const Home = () => {
    const[bet, setBet] = useState(10);
    const[balance, setBalance] = useState(100);

    const user = JSON.parse(localStorage.getItem("user"));
        

    const token = localStorage.getItem("token");

  useEffect(() => {
    if(!token) {
        window.location.href = "/login";
        return;
    }

    const fetchWallet = async()=>{
        console.log("Home loaded");
        try{
            console.log("Fetching wallet...");
            const res = await fetch("http://localhost:5000/api/wallet", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                cache: "no-cache"
            });

            console.log("status",res.status);

            const text = await res.text();
   console.log("text",text);

   const data = JSON.parse(text);
            setBalance(data.wallet);

        }catch(err){
            console.log(err);
            console.log("ERROR:", err);
        }
    };

    fetchWallet();
       
  },[])

  const handleAddMoney = async () => {

    const res = await fetch("http://localhost:5000/api/wallet/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            amount: 100
        })
    });

    const data = await res.json();

    setBalance(data.wallet);
    
  };

  const handleWithdraw = async() => {
    const res = await fetch("http://localhost:5000/api/wallet/deduct", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            amount: 50
        })
    });

    const data = await res.json();

    setBalance(data.wallet);
  };
 
 
    
    return (
        <div className="home">
            <h1> Betting Card Game</h1>

            <p>Welcome {user?.name}</p>

            <div className="wallet"> 
                <p>Balance : ₹{balance}</p>

                <button onClick={handleAddMoney}>Add Money</button>
                <button onClick={handleWithdraw}>Withdraw</button>  
            </div>
        <div className="bet-section">
            <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))}/>
            <p>Winning: ₹{bet * 3}</p>
        </div>
        <GameBoard bet={bet} balance={balance} setBalance={setBalance} />

        <button onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href="/login";
        }}>
            Logout
        </button>
        </div>
    );
};

export default Home;