const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  attendEvent,
  leaveEvent
} = require("../controllers/eventController");

const { auth } = require("../middlewares/authMiddleware"); 

const router = express.Router();


router.post("/", auth, createEvent);


router.get("/", getAllEvents);


router.get("/:eventId", getEventById);


router.put("/:eventId", auth, updateEvent);


router.delete("/:eventId", auth, deleteEvent);


router.post("/:eventId/attend", auth, attendEvent);


router.post("/:eventId/leave", auth, leaveEvent);

module.exports = router;
