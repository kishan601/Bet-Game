const express = require("express");

const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
 

router.get ("/users", authMiddleware, async (req, res) => {
    try{
        if(!req.user.isAdmin){
            return res.status(403).json({ message: "Access Denied" });
        }

        const users = await User.find().select("-password");
        res.json(users);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;