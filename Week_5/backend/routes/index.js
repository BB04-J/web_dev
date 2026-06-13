require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const path = require('path');
const userRoutes = require('./user');
const todoRoutes = require('./todo');
require("../db");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/user', userRoutes);
app.use('/todo', todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
