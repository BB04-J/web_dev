const express = require ("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const userMiddleware = require("../middleware/user");
const userrouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ;

userrouter.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

userrouter.post("/login", async (req, res) => {
    const {email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({ message: "Invalid email or User doesnot exist" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid  password" });
        }
     
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ 
            message: "Login successful",
            token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

userrouter.get("/me", userMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = userrouter;