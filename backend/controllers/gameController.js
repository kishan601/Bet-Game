const User = require('../models/User');

const generateNumbers = () => {
  const set = new Set();
  while (set.size < 5) {
    set.add(Math.floor(Math.random() * 100));
  }
  const row1 = [...set];
  const row2 = [...row1].sort(() => Math.random() - 0.5);
  return { row1, row2 };
};

exports.placeBetAndStart = async (req, res) => {
  try {
    const { betAmount } = req.body;

    if (betAmount <= 0 || betAmount > 5000) {
      return res.status(400).json({ message: 'Invalid bet amount' });
    }

    const currentWallet = parseFloat(req.user.wallet);
    if (currentWallet < betAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const newWallet = currentWallet - parseFloat(betAmount);
    await User.updateWallet(req.user.id, newWallet);

    const { row1, row2 } = generateNumbers();

    res.json({
      message: 'Game started',
      betAmount,
      wallet: newWallet,
      row1,
      row2
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.playMove = async (req, res) => {
  try {
    const { row1, row2, index1, index2, betAmount } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = row1[index1] === row2[index2];

    let winnings = 0;
    let currentWallet = parseFloat(user.wallet);

    if (isMatch) {
      winnings = betAmount * 3;
      currentWallet += winnings;
      await User.updateWallet(user.id, currentWallet);
    }

    const shuffledRow1 = [...row1].sort(() => Math.random() - 0.5);
    const shuffledRow2 = [...row2].sort(() => Math.random() - 0.5);

    res.json({
      match: isMatch,
      winnings,
      wallet: currentWallet,
      row1: shuffledRow1,
      row2: shuffledRow2,
      gameOver: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
