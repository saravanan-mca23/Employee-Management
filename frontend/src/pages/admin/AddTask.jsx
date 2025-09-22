import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employees, setEmployees] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

  const links = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/add-task", label: "Add Task" },
    { path: "/admin/view-tasks", label: "View Tasks" },
    { path: "/admin/employees", label: "Employees" },
    { path: "/admin/view-attendance", label: "View Attendance" },
    { path: "/admin/view-leaves", label: "View Leaves" },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/users/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.msg || "Error fetching employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/tasks", { title, description, assignedTo });
      toast.success("Task added successfully!");
      setTitle("");
      setDescription("");
      setAssignedTo("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error adding task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8">
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-emerald-400 mb-6">Add New Task</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Task Title"
              className="p-3 rounded bg-black/20 border border-emerald-400/40"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              className="p-3 rounded bg-black/20 border border-emerald-400/40"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="p-3 rounded bg-black/20 border border-emerald-400/40"
              required
            >
              <option value="">Assign to</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="p-3 bg-emerald-400 text-black font-bold rounded hover:bg-emerald-500 transition"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
