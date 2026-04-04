import { signupUser, signinUser, refreshToken, logoutUser, googleLogin } from "../controllers/auth.js";
import express from "express";

const router = express.Router();

router.post("/register", signupUser);
router.post("/login", signinUser);
router.get("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.post("/google", googleLogin);

export default router;
