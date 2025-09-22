const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  applyLeave,
  viewLeaves,
  updateLeaveStatus,
  viewMyLeaves,
  deleteLeave
} = require("../controllers/leaveController");

// Employee applies for leave
router.post("/", auth("employee"), applyLeave);

// Admin views all leaves
router.get("/", auth("admin"), viewLeaves);

// Admin approves or rejects a leave
router.patch("/:id", auth("admin"), updateLeaveStatus);

// Employee views their own leaves
router.get("/my", auth("employee"), viewMyLeaves);

// Admin deletes a leave
router.delete("/:id", auth("admin"), deleteLeave);

module.exports = router;
