import express from "express";
import {
  getTicketDetails,
  registerUser,
  updateRegistration,
} from "../controllers/registration.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.get("/ticket/:id", getTicketDetails);
router.put("/:id/status", protect, updateRegistration);

export default router;
