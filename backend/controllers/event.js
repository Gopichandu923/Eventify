import EventModel from "../models/event.js";
import RegistrationModel from "../models/registration.js";
import mongoose from "mongoose";
//POST create event
export const createEvent = async (req, res) => {
  const { title, description, date, venue, ticketLimit, approvalMethod } =
    req.body;
  if (
    !title ||
    !description ||
    !date ||
    !venue ||
    !ticketLimit ||
    !approvalMethod
  ) {
    return res.status(400).json({ message: "Please provide all details." });
  }
  try {
    const userId = req.user.id;
    const newEvent = new EventModel({
      title,
      description,
      date,
      venue,
      ticketLimit,
      organizer: userId,
      availableTickets: ticketLimit,
      approvalMethod,
    });
    await newEvent.save();
    return res.status(201).json(newEvent);
  } catch (error) {
    console.log("Error during event creation : " + error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//GET to get all events of an organizer
export const getMyEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // 🎯 CRITICAL FIX: Validate the ID format BEFORE querying Mongoose
    if (!organizerId || !mongoose.isValidObjectId(organizerId)) {
      console.log("Invalid organizer ID received:", organizerId);
      // If the ID is bad, we cannot cast it, hence the error.
      // Return 400 early to prevent the server crash.
      return res
        .status(400)
        .json({ message: "Invalid organizer ID provided by token." });
    }
    const events = await EventModel.find({ organizer: organizerId.toString() });
    return res.status(200).json(events);
  } catch (error) {
    console.log("Error retrieving all events of an organizer:" + error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//GET get event details
export const getEventDetails = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please provide event id." });
  }
  try {
    const event = await EventModel.findOne({ _id: id }).select("-organizer");
    if (!event) {
      return res.status(404).json({ message: `Event not found with id ${id}` });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//GET get event registrations of an event
export const getRegistrations = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please provide event id." });
  }
  try {
    const event = await EventModel.findOne({ _id: id });

    if (!event || event.organizer.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Event not found or unauthorized" });
    }
    const registrations = await RegistrationModel.find({ event: id });
    return res.status(200).json({ event, registrations });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//GET all events (public)
export const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find();
    return res.status(200).json(events);
  } catch (error) {
    console.log("Error retrieving all events:" + error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
