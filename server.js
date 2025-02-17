const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const eventRoutes = require("./routes/eventRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// Import Socket Initialization
const { initializeSocket } = require("./controllers/chatController");

// Load environment variables
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server); // Initialize WebSocket and pass the server

// Attach io instance to req object
app.use((req, res, next) => {
  req.io = io; // Attach WebSocket instance to each request
  next();
});

// Middleware
app.use(
  cors({
    origin: "https://eventify-orcin-beta.vercel.app/", // Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connecting to Cloudinary
cloudinaryConnect();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
