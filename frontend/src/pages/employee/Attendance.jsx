import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function Attendance() {
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [report, setReport] = useState({ present: 0, absent: 0 });
  const [fetching, setFetching] = useState(true);

const links = [
   { path: "/employee/dashboard", label: "Dashboard" },
  { path: "/employee/view-tasks", label: "View Tasks" },
  { path: "/employee/attendance", label: "Attendance" },
  { path: "/employee/apply-leave", label: "Apply Leave" },
];

  // Fetch attendance history
  const fetchAttendance = async () => {
    setFetching(true);
    try {
      const res = await API.get("/attendance"); // Use correct route
      setAttendance(res.data);

      // Calculate present/absent report
      const present = res.data.filter((a) => a.status === "Present").length;
      const absent = res.data.filter((a) => a.status === "Absent").length;
      setReport({ present, absent });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error fetching attendance");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Mark attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/attendance", { status });
      toast.success(res.data.msg || "Attendance marked successfully!");
      fetchAttendance(); // Refresh attendance history
    } catch (err) {
      if (err.response?.status === 400) {
        toast.warning(err.response.data.msg || "You have already marked attendance today");
      } else {
        toast.error(err.response?.data?.msg || "Error marking attendance");
      }
    } finally {
      setLoading(false);
    }
  };

  // For highlighting today's record
  const todayStr = new Date().toDateString();

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8 flex flex-col items-center">

        {/* Mark Attendance */}
        <div className="w-full max-w-4xl bg-black/30 backdrop-blur-xl p-8 rounded-3xl mb-8">
          <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">Mark Your Attendance</h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-center gap-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-4 rounded-2xl bg-black/20 border border-emerald-400/40 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="p-4 bg-emerald-400 text-black font-bold rounded-2xl hover:bg-emerald-500 transition"
            >
              {loading ? "Submitting..." : "Mark Attendance"}
            </button>
          </form>
        </div>

        {/* Attendance Report */}
        <div className="w-full max-w-4xl bg-black/30 backdrop-blur-xl p-6 rounded-3xl mb-6">
          <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">Your Attendance Report</h2>
          <div className="flex justify-around text-center">
            <p>Total Present: <span className="text-emerald-400 font-bold">{report.present}</span></p>
            <p>Total Absent: <span className="text-red-400 font-bold">{report.absent}</span></p>
            <p>Total Days: <span className="font-bold">{attendance.length}</span></p>
          </div>
        </div>

        {/* Attendance History */}
        <div className="w-full max-w-4xl flex flex-col gap-4">
          {fetching ? (
            <p className="text-center">Loading attendance...</p>
          ) : attendance.length === 0 ? (
            <p className="text-center text-gray-300">No attendance records found.</p>
          ) : (
            attendance.map((att, index) => {
              const isToday = new Date(att.date).toDateString() === todayStr;
              return (
                <div
                  key={att._id}
                  className={`flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-emerald-400/40 ${
                    isToday ? "ring-2 ring-emerald-400" : ""
                  }`}
                >
                  <p className="font-bold text-emerald-400">Day {index + 1}</p>
                  <p className="flex-1 text-center">
                    <strong>Status:</strong>{" "}
                    <span className={att.status === "Present" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                      {att.status}
                    </span>
                  </p>
                  <p className="flex-1 text-right text-gray-300">{new Date(att.date).toLocaleDateString()}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
