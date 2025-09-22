import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function ViewLeaves() {
  const [leaves, setLeaves] = useState([]);
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
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leave");
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error fetching leaves");
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await API.patch(`/leave/${id}`, { status });
      toast.success(`Leave ${status.toLowerCase()} successfully!`);
      fetchLeaves();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || `Error updating leave`);
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;

    try {
      await API.delete(`/leave/${id}`);
      toast.success("Leave deleted successfully!");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error deleting leave");
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-emerald-400 mb-6">All Leaves</h2>
        {loading ? (
          <p>Loading...</p>
        ) : leaves.length === 0 ? (
          <p>No leaves found.</p>
        ) : (
          <div className="grid gap-4">
            {leaves.map((leave) => (
              <div
                key={leave._id}
                className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-emerald-400/40"
              >
                <p>Employee: {leave.employee?.name || "N/A"}</p>
                <p>From: {new Date(leave.fromDate).toLocaleDateString()}</p>
                <p>To: {new Date(leave.toDate).toLocaleDateString()}</p>
                <p>Reason: {leave.reason}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      leave.status === "Approved"
                        ? "text-emerald-400 font-bold"
                        : leave.status === "Rejected"
                        ? "text-red-400 font-bold"
                        : "text-yellow-400 font-bold"
                    }
                  >
                    {leave.status}
                  </span>
                </p>

                <div className="mt-3 flex gap-3">
                  {leave.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateLeaveStatus(leave._id, "Approved")}
                        className="bg-emerald-500 px-4 py-2 rounded hover:bg-emerald-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateLeaveStatus(leave._id, "Rejected")}
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteLeave(leave._id)}
                    className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
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
