import EventModel from "../models/event.js";

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
      approvalMethod,
    });
    await newEvent.save();
    return res.status(201).json(newEvent);
  } catch (error) {
    console.log("Error during event creation : " + error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
