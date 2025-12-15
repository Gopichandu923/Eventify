import express from "express";
import {
  getTicketDetails,
  getTicketId,
  registerUser,
  updateRegistration,
} from "../controllers/registration.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.put("/:id/status", protect, updateRegistration);
router.get("/tickets/lookup/", getTicketId);
router.get("/tickets/:id", getTicketDetails);

export default router;
