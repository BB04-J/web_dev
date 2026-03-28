const express = require("express");
const abc = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "assignment";
const path = require("path");

const cors = require("cors")
abc.use(cors())

abc.use(express.static(path.join(__dirname, "../frontend")));

abc.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/signup.html"));
});

abc.use(express.json()); // helps server to read the json data
let users = [];
abc.post("/signup", async function (req, res) {
    const { name, email, password } = req.body
    // users.push(req.body); not prefered as while signup there must be extra data we dont require

    const user = users.find(u => u.email === email);
    if (user) {
        return res.send("User Already Exists");
    }

    const cryptedpassword = await bcrypt.hash(password, 10);
    const newuser = {
        name, email, password: cryptedpassword
    };
    users.push(newuser);
    res.send("Sign up Successful");


});

abc.post("/login", async function (req, res) {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.send("User Does Not Exists");
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.send("Password is Incorrect");
    }
    const token = jwt.sign({ email: email }, secret, { expiresIn: "1h" });
    res.send({
        message: "Login Successful",
        token: token
    });


});
function middleman(req, res, next) {
    const userauth = req.headers.authorization;
    if (!userauth) {
        return res.send("Token is Missing");
    }
    const token = userauth.split(" ")[1];
    const auth = jwt.verify(token, secret);
    const user = users.find(u => u.email === auth.email);
    if (!user) {
        return res.send("User Not Found");
    }
    req.user = user;
    next();
}
abc.get("/me", middleman, function (req, res) {
    res.send({
        name: req.user.name,
        email: req.user.email
    });
});

abc.listen(3000);
