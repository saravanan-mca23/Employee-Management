import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function ViewAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const links = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/add-task", label: "Add Task" },
    { path: "/admin/view-tasks", label: "View Tasks" },
    { path: "/admin/employees", label: "Employees" },
    { path: "/admin/view-attendance", label: "View Attendance" },
    { path: "/admin/view-leaves", label: "View Leaves" },
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get("/attendance");
        setAttendance(res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.msg || "Error fetching attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-emerald-400 mb-6">Attendance Records</h2>
        {loading ? (
          <p>Loading...</p>
        ) : attendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <div className="grid gap-4">
            {attendance.map((att) => (
              <div
                key={att._id}
                className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-emerald-400/40"
              >
                <p>Employee: {att.employee?.name || "N/A"}</p>
                <p>Date: {new Date(att.date).toLocaleDateString()}</p>
                <p>
                  Status:{" "}
                  <span className={att.status === "Present" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                    {att.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
