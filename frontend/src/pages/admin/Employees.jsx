import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
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
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/users/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.msg || "Error fetching employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="flex bg-gray-900 min-h-screen text-white">
      <Sidebar links={links} />
      <div className="flex-1 p-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-emerald-400 mb-6">Employees</h2>

        {loading ? (
          <p>Loading...</p>
        ) : employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {employees.map((emp, index) => (
              <div
                key={emp._id}
                className="w-full bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-emerald-400/40 flex justify-between items-center"
              >
                {/* Employee ID */}
                <p className="w-1/4 font-bold text-emerald-400 text-left">
                  Employee ID: {index + 1}
                </p>

                {/* Name */}
                <p className="w-1/2 text-center">
                  <strong>Name:</strong> {emp.name}
                </p>

                {/* Email */}
                <p className="w-1/4 text-right">
                  <strong>Email:</strong> {emp.email}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
