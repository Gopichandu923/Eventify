import express from "express";
import {
  createEvent,
  getEventDetails,
  getMyEvents,
  getRegistrations,
} from "../controllers/event.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", protect, getMyEvents);
router.get("/:id", getEventDetails);
router.get("/:id/registrations", protect, getRegistrations);
export default router;
