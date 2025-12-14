import Registration from "../models/registration";
import Event from "../models/event";

//POST to register user for event
export const registerUser = async (req, res) => {
  const { name, email, event } = req.body;
  if (!name || !email || !event) {
    return res
      .status(400)
      .json({ message: "Please provide name,email and eventId." });
  }
  try {
    const event = await Event.findById(event);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    if (parseInt(event.availableTickets) === 0) {
      res.status(400).json({ message: "Tickets are filled." });
    }
    let status = "Pending";
    if (event.approvalMethod === "auto") {
      status = "Approved";
    }
    const registration = new Registration({ event, name, email, status });
    const newRegistration = await registration.save();
    return res.status(201).json(newRegistration);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//PUT update registration status
export const updateRegistration = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Please provide ticket id." });
  }
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }
  try {
    const registration = await Registration.findById(id).populate("event");
    if (registration.event.organizer.toSting() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized action." });
    }
    if (registration.event.approvalMode !== "manual") {
      return res
        .status(400)
        .json({ msg: "Status change only allowed for manual approval events" });
    }

    registration.status = status;
    await registration.save();

    res.json(registration);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//GET ticket details
export const getTicketDetails = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please provide ticket Id." });
  }
  try {
    const ticket = await Registration.findById(id).populate(
      "event",
      "title description date venue"
    );
    if (!ticket) return res.status(404).json({ msg: "Ticket not found." });
    if (ticket.status !== "Approved") {
      return res.status(403).json({
        msg: `Ticket status is ${ticket.status}. Awaiting organizer approval.`,
      });
    }

    res.json({
      ticketId: id,
      status: ticket.status,
      event: ticket.event,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
