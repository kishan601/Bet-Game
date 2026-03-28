const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getWallet,
  addMoney,
  deductMoney
} = require("../controllers/walletController");

router.get("/", authMiddleware, getWallet);
router.post("/add", authMiddleware, addMoney);
router.post("/deduct", authMiddleware, deductMoney);

module.exports = router;