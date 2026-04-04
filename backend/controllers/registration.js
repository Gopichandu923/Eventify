import Registration from "../models/registration.js";
import Event from "../models/event.js";

// POST – Register user for event

export const registerUser = async (req, res) => {
  const { name, email, eventId } = req.body;

  if (!name || !email || !eventId) {
    return res
      .status(400)
      .json({ message: "Please provide name, email and eventId." });
  }
  try {
    const existingRegistration = await Registration.findOne({
      event: eventId,
      email,
    });
    if (existingRegistration) {
      return res.status(400).json({ message: "User already registered." });
    }
    const event = await Event.findOneAndUpdate(
      { _id: eventId, availableTickets: { $gt: 0 } },
      { $inc: { availableTickets: -1 } },
      { new: true }
    );

    if (!event) {
      return res
        .status(400)
        .json({ message: "Tickets are filled or event not found." });
    }
    const status = event.approvalMethod === "auto" ? "Approved" : "Pending";
    const registration = await Registration.create({
      event: eventId,
      name,
      email,
      status,
    });

    return res.status(201).json({
      ticketId: registration._id,
      status: registration.status,
      msg: "Registration submitted successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate registration detected." });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//PUT – Update registration status (manual approval only)

export const updateRegistration = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Please provide registration id." });
  }

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  try {
    const registration = await Registration.findById(id).populate("event");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found." });
    }
    if (registration.status === "Approved") {
      return res.status(200).json({ message: "Ticket already approved." });
    }
    // Organizer authorization check
    if (registration.event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized action." });
    }

    // Check for manual mode
    if (registration.event.approvalMethod !== "manual") {
      return res.status(400).json({
        message: "Status change allowed only for manual approval events.",
      });
    }

    registration.status = status;
    await registration.save();

    return res.status(200).json({ message: "Successfully approved." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// GET – Ticket details

export const getTicketDetails = async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined" || id === "null") {
    return res.status(400).json({ message: "Invalid ticket ID provided." });
  }

  try {
    const ticket = await Registration.findById(id).populate(
      "event",
      "title description date venue"
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket record not found. Please register again or contact support." });
    }

    if (ticket.status !== "Approved") {
      return res.status(403).json({
        message: `Your registration status is currently "${ticket.status}". Tickets are only available for viewing after organizer approval.`,
        status: ticket.status,
      });
    }

    return res.json({
      ticketId: ticket._id,
      name: ticket.name,
      email: ticket.email,
      status: ticket.status,
      event: ticket.event,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Ticket ID format. Please check your link." });
    }
    console.error("Ticket Fetch Error:", error);
    return res.status(500).json({ message: "Server error while fetching ticket details." });
  }
};

export const getTicketId = async (req, res) => {
  const { eventId, email } = req.query;

  if (!eventId || !email) {
    return res.status(400).json({ message: "Please provide both Event ID and Email address for lookup." });
  }

  try {
    const ticket = await Registration.findOne({
      event: eventId,
      email: email,
    }).populate("event", "title description date venue");

    if (!ticket) {
      return res.status(404).json({ message: "No ticket found for this email and event. Please verify your details." });
    }

    // Return the ticket details. Note: If not approved, we still return the ID so the user can check the status page
    return res.json({
      ticketId: ticket._id,
      name: ticket.name,
      email: ticket.email,
      status: ticket.status,
      message: ticket.status === "Approved"
        ? "Ticket found and ready for download."
        : `Ticket found. Current status: ${ticket.status}.`,
      event: ticket.event,
    });
  } catch (error) {
    console.error("Ticket Lookup Error:", error);
    return res.status(500).json({ message: "Server error while performing ticket lookup." });
  }
};
