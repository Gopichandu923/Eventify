import express from "express";
import {
  createEvent,
  getEventDetails,
  getMyEvents,
  getRegistrations,
  getAllEvents,
} from "../controllers/event.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", protect, getMyEvents);
router.get("/all", getAllEvents);
router.get("/:id", getEventDetails);
router.get("/:id/registrations", protect, getRegistrations);
export default router;
