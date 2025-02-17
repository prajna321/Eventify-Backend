const express = require("express");
const multer = require("multer");
const { uploadProfilePicture } = require("../controllers/uploadController");

const router = express.Router();


const storage = multer.memoryStorage(); 
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

router.post("/profile-picture", upload.single("image"), uploadProfilePicture);

module.exports = router;
