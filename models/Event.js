const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxAttendees: { type: Number, default: 100 },
    image: { type: String },
    attendeeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);


eventSchema.pre("save", function (next) {
  this.attendeeCount = this.attendees.length;
  next();
});

module.exports = mongoose.model("Event", eventSchema);

