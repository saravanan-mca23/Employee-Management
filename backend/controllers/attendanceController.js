const Attendance = require("../models/Attendance");

// Employee marks their attendance
exports.markAttendance = async (req, res) => {
  const { status } = req.body;
  const employeeId = req.user.id;

  try {
    // Define start and end of today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Check if attendance already marked for today
    const existing = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (existing) {
      return res.status(400).json({ msg: "Attendance already marked for today" });
    }

    const attendance = new Attendance({ employee: employeeId, status });
    await attendance.save();

    res.json({ msg: "Attendance marked successfully", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// View attendance (admin or employee)
exports.viewAttendance = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "employee") {
      query = { employee: req.user.id };
    }

    const attendance = await Attendance.find(query).populate("employee", "name email");
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
