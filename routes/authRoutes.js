const express = require("express");
const { signup, login, changePassword, logout } = require("../controllers/authController");
const { auth } = require("../middlewares/authMiddleware");

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);


router.put("/change-password", auth, changePassword);
router.post("/logout", auth, logout); 

module.exports = router;
