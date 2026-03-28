const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  getAllUsers,
  updateWallet,
  getStats
} = require("../controllers/adminController");

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.post("/wallet", authMiddleware, adminMiddleware, updateWallet);
// router.get("/stats", authMiddleware, adminMiddleware, getStats);

module.exports = router;