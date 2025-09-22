import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";
import { toast } from "react-toastify";

export default function EmployeeDashboard() {
  const links = [
    { path: "/employee/dashboard", label: "Dashboard" },
    { path: "/employee/view-tasks", label: "View Tasks" },
    { path: "/employee/attendance", label: "Attendance" },
    { path: "/employee/apply-leave", label: "Apply Leave" },
  ];

  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tasksRes, attendanceRes, leavesRes] = await Promise.all([
          API.get("/tasks/my"),
          API.get("/attendance/my"),
          API.get("/leave/my"),
        ]);

        setTasks(tasksRes.data);
        setAttendance(attendanceRes.data);
        setLeaves(leavesRes.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.msg || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Pending Tasks", value: tasks.filter(t => t.progress === "Not Started").length, color: "red" },
    { label: "In Progress Tasks", value: tasks.filter(t => t.progress === "In Progress").length, color: "orange" },
    { label: "Completed Tasks", value: tasks.filter(t => t.progress === "Completed").length, color: "green" },
    { label: "Leaves Taken", value: leaves.filter(l => l.status === "Approved").length, color: "yellow" },
    { label: "Attendance Today", value: attendance.some(a => a.date.slice(0,10) === new Date().toISOString().slice(0,10)) ? "✔️" : "❌", color: "blue" },
    { label: "Total Tasks", value: tasks.length, color: "purple" },
  ];

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8">
        {/* Welcome Box */}
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-emerald-400">Welcome, {user?.name}</h2>
          <p className="mt-4 text-gray-300">Use the sidebar to check your tasks, attendance, and leaves.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-black/30 backdrop-blur-md p-6 rounded-2xl shadow-lg border-l-4 border-${stat.color}-400`}>
              <h3 className={`text-${stat.color}-400 text-xl font-semibold`}>{stat.label}</h3>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {loading && <p className="text-gray-400">Loading data...</p>}
        <Outlet />
      </div>
    </div>
  );
}
