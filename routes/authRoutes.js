const express = require("express");
const { registerUser, verifyOtp, loginUser } = require("../controllers/authController");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

module.exports = router;
