const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URL } = process.env;

const connectDB = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(" DB Connection Successful"))
    .catch((err) => {
      console.error(" DB Connection Failed:", err);
      process.exit(1);
    });
};

module.exports = connectDB;
