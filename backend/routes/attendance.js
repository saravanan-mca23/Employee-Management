const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { markAttendance, viewAttendance } = require("../controllers/attendanceController");

// Employee marks attendance
router.post("/", auth("employee"), markAttendance);

// View attendance
// Admin sees all, employee sees only their own
router.get("/", auth(), viewAttendance);

router.get("/my", auth(), viewAttendance);

module.exports = router;
