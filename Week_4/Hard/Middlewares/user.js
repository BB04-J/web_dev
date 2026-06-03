const jwt = require("jsonwebtoken");

const JWT_SECRET = "AaBbCcDd1234";

function userMiddleware(req, res, next) {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            msg: "Token missing"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.userId = decoded.id;

        next();

    } catch (err) {

        return res.status(403).json({
            msg: "Invalid token"
        });

    }
}

module.exports = userMiddleware;