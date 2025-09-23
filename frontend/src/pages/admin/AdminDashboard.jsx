import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const links = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/add-task", label: "Add Task" },
    { path: "/admin/view-tasks", label: "View Tasks" },
    { path: "/admin/employees", label: "Employees" },
    { path: "/admin/view-attendance", label: "View Attendance" },
    { path: "/admin/view-leaves", label: "View Leaves" },
  ];

  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [employeesRes, tasksRes, attendanceRes, leavesRes] = await Promise.all([
          API.get("/users/employees"),
          API.get("/tasks"),
          API.get("/attendance"),
          API.get("/leave"),
        ]);

        const employees = employeesRes.data;
        const tasks = tasksRes.data;
        const attendance = attendanceRes.data;
        const leaves = leavesRes.data;

        setStats([
          { label: "Total Employees", value: employees.length, color: "emerald" },
          { label: "Active Tasks", value: tasks.filter(t => t.progress === "In Progress").length, color: "blue" },
          { label: "Pending Tasks", value: tasks.filter(t => t.progress === "Not Started").length, color: "red" },
          { label: "Leave Requests", value: leaves.filter(l => l.status === "Pending").length, color: "yellow" },
          { label: "Attendance Today",  value: attendance.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length, color: "purple" },
          { label: "Completed Tasks", value: tasks.filter(t => t.progress === "Completed").length, color: "teal" },
        ]);
        

      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.msg || "Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8">
        {/* Welcome Box */}
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-emerald-400">Welcome, {user?.name}</h2>
          <p className="mt-4 text-gray-300">Use the sidebar to navigate the dashboard.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border-l-4 border-${stat.color}-400`}>
              <h3 className={`text-${stat.color}-400 text-xl font-semibold`}>{stat.label}</h3>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {loading && <p className="mt-4 text-gray-400">Loading stats...</p>}
      </div>
    </div>
  );
}
