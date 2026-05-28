const express = require("express");

const router = express.Router();

const {
    signup,
    login,
} = require("../controllers/authController");

const validate = require("../middleware/validateMiddleware");

const {
    signupSchema,
    loginSchema,
} = require("../validators/authValidation");

router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);

module.exports = router;