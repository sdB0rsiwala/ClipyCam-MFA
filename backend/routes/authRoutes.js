const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// ✅ Use `authController.<functionName>` to ensure valid function references
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
