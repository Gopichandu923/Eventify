import { signupUser } from "../controllers/auth.js";
import express from "express";

const router = express.Router();

router.post("/register", signupUser);

export default router;
