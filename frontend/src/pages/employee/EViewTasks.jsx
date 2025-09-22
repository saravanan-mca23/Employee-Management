import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function EViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [updating, setUpdating] = useState(null);

 const links = [
   { path: "/employee/dashboard", label: "Dashboard" },
  { path: "/employee/view-tasks", label: "View Tasks" },
  { path: "/employee/attendance", label: "Attendance" },
  { path: "/employee/apply-leave", label: "Apply Leave" },
];


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks"); // backend must allow employees
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.msg || "Error fetching tasks");
      }
    };
    fetchTasks();
  }, []);

  const handleProgressChange = async (taskId, progress) => {
    try {
      setUpdating(taskId);
      const res = await API.patch(`/tasks/${taskId}/progress`, { progress });
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, progress: res.data.progress } : t
        )
      );
      toast.success("Progress updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error updating progress");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-emerald-400 mb-6">Your Tasks</h2>
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-emerald-400/40"
            >
              <h3 className="text-xl font-bold">{task.title}</h3>
              <p className="mb-2">{task.description}</p>
              <p className="text-sm text-gray-300 mb-3">
                Assigned by: {task.createdBy?.name || "N/A"}
              </p>

              {/* Progress Selector */}
              <label className="block mb-2 text-sm font-semibold text-emerald-300">
                Progress:
              </label>
              <select
                value={task.progress || "Not Started"}
                disabled={updating === task._id}
                onChange={(e) => handleProgressChange(task._id, e.target.value)}
                className="p-2 rounded bg-gray-800 text-white border border-emerald-400/40 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
