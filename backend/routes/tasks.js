const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addTask,
  viewTasks,
  updateTask,
  deleteTask,
  updateTaskProgress,
} = require("../controllers/taskController");

// Admin adds a new task
router.post("/", auth("admin"), addTask);

// View all tasks (admin/employee)
router.get("/", auth(), viewTasks);

// Admin updates a task
router.put("/:id", auth("admin"), updateTask);

// Admin deletes a task
router.delete("/:id", auth("admin"), deleteTask);

// Employee gets their own tasks
router.get("/my", auth("employee"), viewTasks);


// Employee updates progress of their task
router.patch("/:id/progress", auth("employee"), updateTaskProgress);

module.exports = router;
