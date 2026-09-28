const express = require("express");

const {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    uploadResume,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const uploadResumeMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

// ===============================
// AUTH ROUTES
// ===============================

// Register
router.post(
    "/register",
    registerUser
);

// Login
router.post(
    "/login",
    loginUser
);

// Get logged-in user
router.get(
    "/me",
    protect,
    getMe
);

// Update profile
router.put(
    "/profile",
    protect,
    updateProfile
);

// Upload resume
router.put(
    "/profile/resume",
    protect,
    uploadResumeMiddleware.single("resume"),
    uploadResume
);

module.exports = router;