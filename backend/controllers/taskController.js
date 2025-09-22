const Task = require("../models/Task");

// Add new task
exports.addTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user.id, // admin ID
    });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


// View tasks
exports.viewTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      // Admin sees all tasks
      tasks = await Task.find()
        .populate("assignedTo", "name email")
        .populate("createdBy", "name");
    } else {
      // Employee sees only tasks assigned to them
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name");
    }

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


// Update a task
exports.updateTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// PATCH /tasks/:id/progress
exports.updateTaskProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // ✅ Only assigned employee can update progress
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to update this task" });
    }

    task.progress = progress;
    await task.save();

    res.json({ progress: task.progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating task progress" });
  }
};

