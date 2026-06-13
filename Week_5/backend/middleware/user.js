const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "taskify_secret";


const userMiddleware = (req, res, next) => {
    const auth = req.headers.token;
    if (!auth) {
        return res.status(401).json({ message: "Unauthorized User" });
    }


    try {
        const decoded = jwt.verify(auth, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = userMiddleware;