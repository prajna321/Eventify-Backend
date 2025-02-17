const Event = require("../models/Event");


exports.createEvent = async (req, res) => {
  try {

    const { name, description, date, location, maxAttendees } = req.body;
    const createdBy = req.user?.id;

   
    if (!name || !description || !date || !location || !maxAttendees) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

 
    const image = req.file ? req.file.path : null;


    const event = await Event.create({
      name,
      description,
      date,
      location,
      createdBy,
      maxAttendees,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({
      success: false,
      message: "Event creation failed",
      error: error.message,
    });
  }
};


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "firstName lastName email") 
      .sort({ date: 1 });

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate("createdBy", "firstName lastName email");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message,
    });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }


    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this event",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      req.body,
      { new: true, runValidators: true } 
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this event",
      });
    }


    await Event.findByIdAndDelete(req.params.eventId);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};




exports.attendEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }


    if (event.attendees.includes(userId)) {
      return res.status(400).json({ success: false, message: "User already attending this event" });
    }


    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ success: false, message: "Event is full" });
    }


    event.attendees.push(userId);
    event.attendeeCount = event.attendees.length;
    await event.save();


    const io = req.app.get("socketio"); 
    if (io) {
      io.to(eventId).emit("attendeeCountUpdated", event.attendeeCount);
    }

    return res.status(200).json({ 
      success: true, 
      message: "User joined event successfully", 
      attendeeCount: event.attendeeCount 
    });
  } catch (error) {
    console.error("Error attending event:", error);
    return res.status(500).json({ success: false, message: "Error attending event", error: error.message });
  }
};


exports.leaveEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    console.log("Event ID:", eventId);
    console.log("User ID:", userId);


    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    console.log("Attendees before leaving:", event.attendees);


    if (!event.attendees.includes(userId)) {
      return res.status(400).json({ success: false, message: "You are not attending this event" });
    }


    event.attendees = event.attendees.filter((id) => id.toString() !== userId.toString());
    event.attendeeCount = event.attendees.length;


    await event.save();

    console.log("Attendees after leaving:", event.attendees);


    req.io.to(eventId).emit("attendeeCountUpdated", event.attendeeCount);

    return res.status(200).json({
      success: true,
      message: "You have successfully left the event",
      attendeeCount: event.attendeeCount,
    });
  } catch (error) {
    console.error("Error in leaveEvent:", error);
    return res.status(500).json({ success: false, message: "Error leaving event", error: error.message });
  }
};
