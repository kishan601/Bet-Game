const User = require('../models/User');

// GET WALLET BALANCE
exports.getWallet = async (req, res) => {
  res.json({ wallet: parseFloat(req.user.wallet) });
};

// ADD MONEY
exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const newWallet = parseFloat(req.user.wallet) + parseFloat(amount);
    const updated = await User.updateWallet(req.user.id, newWallet);

    res.json({ message: 'Money added', wallet: parseFloat(updated.wallet) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DEDUCT MONEY (used for betting)
exports.deductMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const currentWallet = parseFloat(req.user.wallet);
    if (currentWallet < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const newWallet = currentWallet - parseFloat(amount);
    const updated = await User.updateWallet(req.user.id, newWallet);

    res.json({ message: 'Money deducted', wallet: parseFloat(updated.wallet) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
