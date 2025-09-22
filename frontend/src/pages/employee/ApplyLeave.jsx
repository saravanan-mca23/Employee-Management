import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function ApplyLeave() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);

 const links = [
   { path: "/employee/dashboard", label: "Dashboard" },
  { path: "/employee/view-tasks", label: "View Tasks" },
  { path: "/employee/attendance", label: "Attendance" },
  { path: "/employee/apply-leave", label: "Apply Leave" },
];


  // Fetch employee's own leaves
  const fetchMyLeaves = async () => {
    try {
      const res = await API.get("/leave/my"); // create a backend route /leave/my to return only current user's leaves
      setMyLeaves(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error fetching your leaves");
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/leave", { fromDate, toDate, reason });
      toast.success("Leave applied successfully!");
      setFromDate("");
      setToDate("");
      setReason("");
      setMyLeaves([...myLeaves, res.data]); // update list locally
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error applying leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8">
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-emerald-400 mb-6">Apply Leave</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
              className="p-3 rounded bg-black/20 border border-emerald-400/40"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
              className="p-3 rounded bg-black/20 border border-emerald-400/40"
            />
            <textarea
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="p-3 rounded bg-black/20 border border-emerald-400/40"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-3 bg-emerald-400 text-black font-bold rounded hover:bg-emerald-500 transition"
            >
              {loading ? "Applying..." : "Apply Leave"}
            </button>
          </form>
        </div>

        {myLeaves.length > 0 && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4">Your Leaves</h2>
            <div className="grid gap-4">
              {myLeaves.map((leave) => (
                <div
                  key={leave._id}
                  className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-emerald-400/40"
                >
                  <p>
                    From: {new Date(leave.fromDate).toLocaleDateString()} - To:{" "}
                    {new Date(leave.toDate).toLocaleDateString()}
                  </p>
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
