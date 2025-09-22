const Leave = require("../models/Leave");

// Employee applies for leave
exports.applyLeave = async (req, res) => {
  const { fromDate, toDate, reason } = req.body;
  try {
    // Optional: Check if overlapping leaves exist for the same employee
    const existingLeave = await Leave.findOne({
      employee: req.user.id,
      fromDate: { $lte: toDate },
      toDate: { $gte: fromDate },
    });
    if (existingLeave) {
      return res.status(400).json({ msg: "You already have a leave in this date range" });
    }

    const leave = await Leave.create({
      employee: req.user.id,
      fromDate,
      toDate,
      reason,
      status: "Pending",
    });
    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Admin views all leaves
exports.viewLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employee", "name email");
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Admin approves or rejects leave
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ msg: "Leave not found" });

    leave.status = status;
    await leave.save();

    res.json({ msg: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.viewMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user.id });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Admin deletes a leave
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ msg: "Leave not found" });
    res.json({ msg: "Leave deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

