import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/authValidators.js";
import protect from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/me", protect, getMe);

export default router;
