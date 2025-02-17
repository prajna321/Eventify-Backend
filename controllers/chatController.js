const { Server } = require("socket.io");
const Event = require("../models/Event");

let io;


const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinEvent", async (eventId) => {
      socket.join(eventId);
      console.log(`User joined event room: ${eventId}`);


      const event = await Event.findById(eventId).select("attendeeCount");
      if (event) {
        io.to(eventId).emit("attendeeCountUpdated", event.attendeeCount);
      }
    });

    socket.on("leaveEvent", (eventId) => {
      socket.leave(eventId);
      console.log(`User left event room: ${eventId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initializeSocket };
