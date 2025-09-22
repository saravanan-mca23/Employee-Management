import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const links = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/add-task", label: "Add Task" },
    { path: "/admin/view-tasks", label: "View Tasks" },
    { path: "/admin/employees", label: "Employees" },
    { path: "/admin/view-attendance", label: "View Attendance" },
    { path: "/admin/view-leaves", label: "View Leaves" },
  ];

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully!");
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error deleting task");
    }
  };

  // Update task
  const handleUpdate = async (task) => {
    const title = window.prompt("Enter new title:", task.title);
    const description = window.prompt("Enter new description:", task.description);

    if (!title || !description) return;

    try {
      await API.put(`/tasks/${task._id}`, { title, description });
      toast.success("Task updated successfully!");
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error updating task");
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-emerald-400 mb-6">All Tasks</h2>

        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-emerald-400/40 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-xl font-bold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p className="text-sm text-gray-300">
                    Assigned to: {task.assignedTo?.name || "N/A"}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold text-emerald-400">Progress:</span>{" "}
                    {task.progress || "Not Started"}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleUpdate(task)}
                    className="bg-emerald-400 text-black px-3 py-1 rounded hover:bg-emerald-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
