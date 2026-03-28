import { useEffect, useState } from "react";
import API from "../api/axios";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import { useSnackbar } from "notistack";


const Game = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [wallet, setWallet] = useState(0);
  const [betAmount, setBetAmount] = useState("");

  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState([]);

  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);

  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);

  // NEW: inactivity tracker
  const [lastActionTime, setLastActionTime] = useState(Date.now());

  // Fetch wallet
  const fetchWallet = async () => {
    try {
      const res = await API.get("/api/wallet");
      setWallet(res.data.wallet);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // Add money to wallet
  const handleAddMoney = async () => {
    try {
      await API.post("/api/wallet/add", {
        amount: Number(addAmount)
      });

      setAddAmount("");
      fetchWallet();
      enqueueSnackbar("Money added to wallet", { variant: "success" });

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // Withdraw money from wallet
  const handleWithdraw = async () => {
    try {
      await API.post("/api/wallet/deduct", {
        amount: Number(withdrawAmount)
      });

      setWithdrawAmount("");
      fetchWallet();
      enqueueSnackbar("Money withdrawn from wallet", { variant: "success" });

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // Start Game
  const startGame = async () => {
    try {
      const res = await API.post("/api/game/start", {
        betAmount: Number(betAmount)
      });

      setRow1(res.data.row1);
      setRow2(res.data.row2);

      setGameStarted(true);

      // reset states
      setMatched([]);
      setAttempts(5);
      setGameOver(false);
      setResult(null);
      setSelected1(null);
      setSelected2(null);

      setLastActionTime(Date.now());

      fetchWallet();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // Handle selection
  const handleSelect = (row, index) => {
    if (!gameStarted || gameOver) return;

    // prevent selecting again before resolution
    if (selected1 !== null && selected2 !== null) return;

    // prevent clicking matched cards
    if (row === 1 && matched.includes(row1[index])) return;
    if (row === 2 && matched.includes(row2[index])) return;

    if (row === 1 && selected1 === null) {
      setSelected1(index);
    } else if (row === 2 && selected2 === null) {
      setSelected2(index);
    }

    setLastActionTime(Date.now());
  };

  // Shuffle helper
  const shuffle = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // Inactivity-based shuffle (FIXED)
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // Don't shuffle during selection
      if (selected1 !== null || selected2 !== null) return;

      // Shuffle after 3s inactivity
      if (now - lastActionTime >= 3000) {
        setRow1((prev) => shuffle(prev));
        setRow2((prev) => shuffle(prev));
        setLastActionTime(now);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [gameStarted, selected1, selected2, gameOver, lastActionTime]);

  // Handle turn trigger
  useEffect(() => {
    if (selected1 !== null && selected2 !== null) {
      handleTurn();
    }
  }, [selected1, selected2]);

  // Handle turn (FIXED ORDER + NO RACE CONDITIONS)
  const handleTurn = () => {
    if (gameOver) return;

    const val1 = row1[selected1];
    const val2 = row2[selected2];

    if (matched.includes(val1)) return;

    const isMatch = val1 === val2;

    if (isMatch) {
      setMatched((prev) => [...prev, val1]);
    }

    setAttempts((prev) => prev - 1);

    setTimeout(() => {
      // flip back first
      setSelected1(null);
      setSelected2(null);

      // shuffle only if wrong AFTER flip
      if (!isMatch) {
        setRow1((prev) => shuffle(prev));
        setRow2((prev) => shuffle(prev));
      }
    }, 800);

    setLastActionTime(Date.now());
  };

  // Game End Logic
  useEffect(() => {
    if (!gameStarted) return;

    if (matched.length === 3) {
      setResult("win");
      setGameOver(true);
      handleWin();
    } else if (attempts === 0) {
      setResult("lose");
      setGameOver(true);
    }
  }, [matched, attempts]);

  // Handle Win
  const handleWin = async () => {
    try {
      const winnings = Number(betAmount) * 3;

      await API.post("/api/wallet/add", {
        amount: winnings
      });

      fetchWallet();
    } catch (err) {
      console.log(err);
    }
  };

  // Reset Game
  const resetGame = () => {
    setGameStarted(false);
    setRow1([]);
    setRow2([]);
    setSelected1(null);
    setSelected2(null);
    setMatched([]);
    setAttempts(5);
    setGameOver(false);
    setResult(null);
    setBetAmount("");
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <Navbar gameStarted={gameStarted} />

      <div style={{ textAlign: "center", padding: "30px" }}>
        <h3>Wallet: ₹{wallet}</h3>
        <div style={styles.walletBox}>

          {/* Add Money */}
          <div>
            <input
              type="number"
              placeholder="Add money"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              style={styles.input}
            />
            <button style={styles.greenBtn} onClick={handleAddMoney}>
              Add
            </button>
          </div>

          {/* Withdraw */}
          <div>
            <input
              type="number"
              placeholder="Withdraw money"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              style={styles.input}
            />
            <button style={styles.redBtn} onClick={handleWithdraw}>
              Withdraw
            </button>
          </div>

        </div>

        {!gameStarted && (

          <div style={{ marginTop: "20px" }}>
            {/* Game Instructions */}
            <div
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "left",
                marginBottom: "20px",
                border: "1px solid #334155"
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#38bdf8" }}>
                🎮 How to Play
              </h3>

              <ul style={{ lineHeight: "1.6", fontSize: "14px" }}>
                <li>You have <b>5 attempts</b></li>
                <li>Select <b>1 card from each row</b></li>
                <li>If both cards match → they stay open ✅</li>
                <li>If they don’t match → they flip back ❌</li>
                <li>You need <b>3 matches to win</b></li>
                <li>Cards shuffle if you're inactive for <b>3 seconds</b></li>
                <br />
                <li>
                  <b>Win:</b> Earn <span style={{ color: "#22c55e" }}>3× your bet amount</span> 💰
                </li>
                <li>
                  <b>Lose:</b> You get <span style={{ color: "#ef4444" }}>nothing</span> ❌
                </li>
              </ul>
            </div>

            <input
              type="number"
              placeholder="Enter bet amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                marginRight: "10px"
              }}
            />
            <button
              onClick={startGame}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                background: "#22c55e",
                color: "white",
                border: "none"
              }}
            >
              Start Game
            </button>
          </div>
        )}

        {gameStarted && (
          <>
            <h4 style={{ marginTop: "20px" }}>
              Attempts Left: {attempts}
            </h4>

            <h4 style={{ marginTop: "30px" }}>Row 1</h4>
            <div style={styles.row}>
              {row1.map((num, i) => (
                <Card
                  key={i}
                  value={num}
                  isFlipped={
                    selected1 === i || matched.includes(num)
                  }
                  onClick={() => handleSelect(1, i)}
                />
              ))}
            </div>

            <h4 style={{ marginTop: "30px" }}>Row 2</h4>
            <div style={styles.row}>
              {row2.map((num, i) => (
                <Card
                  key={i}
                  value={num}
                  isFlipped={
                    selected2 === i || matched.includes(num)
                  }
                  onClick={() => handleSelect(2, i)}
                />
              ))}
            </div>
          </>
        )}

        {/* Result Toast */}
        {result && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              padding: "15px 25px",
              borderRadius: "8px",
              background: result === "win" ? "#22c55e" : "#ef4444",
              color: "white",
              fontWeight: "bold"
            }}
          >
            {result === "win" ? "🎉 You Won!" : "❌ You Lost!"}
          </div>
        )}

        {/* Retry Button */}
        {gameOver && (
          <div style={{ marginTop: "30px" }}>
            <button
              onClick={resetGame}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                background: "#3b82f6",
                color: "white",
                border: "none"
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  row: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "15px"
  },
  walletBox: {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginTop: "20px"
},
input: {
  padding: "8px",
  borderRadius: "6px",
  marginRight: "8px"
},
greenBtn: {
  padding: "8px 16px",
  background: "#22c55e",
  border: "none",
  color: "white",
  borderRadius: "6px"
},
redBtn: {
  padding: "8px 16px",
  background: "#ef4444",
  border: "none",
  color: "white",
  borderRadius: "6px"
}
};

export default Game;