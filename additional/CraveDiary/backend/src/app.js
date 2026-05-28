const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dessertRoutes = require("./routes/dessertRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("SweetCrave API Running");
});

app.use("/api/auth", authRoutes);

app.use("/api/desserts", dessertRoutes);

app.use(errorMiddleware);

module.exports = app;