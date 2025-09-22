const express = require("express");
const router = express.Router();
const { getProfile, login, register } = require("../controllers/authController");
const auth = require("../middleware/auth");

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected route
router.get("/profile", auth(), getProfile);

module.exports = router;
