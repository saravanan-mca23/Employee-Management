const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getEmployees, deleteUser } = require("../controllers/userController");

// Admin-only routes
router.get("/employees", auth("admin"), getEmployees);
router.delete("/:id", auth("admin"), deleteUser);

module.exports = router;
