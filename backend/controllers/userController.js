const User = require("../models/User");

// GET all employees (admin only)
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("name email role");
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE user by ID (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    await user.remove();
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
