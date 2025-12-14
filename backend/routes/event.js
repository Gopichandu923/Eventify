import express from "express";
import { createEvent } from "../controllers/event.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createEvent);

export default router;
