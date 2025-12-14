import { signupUser, signinUser } from "../controllers/auth.js";
import express from "express";

const router = express.Router();

router.post("/register", signupUser);
router.post("/login", signinUser);

export default router;
