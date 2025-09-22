import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AddTask from "./pages/admin/AddTask.jsx";
import ViewTasks from "./pages/admin/ViewTasks.jsx";
import Employees from "./pages/admin/Employees.jsx";
import ViewAttendance from "./pages/admin/ViewAttendance.jsx";
import ViewLeaves from "./pages/admin/ViewLeaves.jsx";

// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EViewTasks from "./pages/employee/EViewTasks.jsx";
import ApplyLeave from "./pages/employee/ApplyLeave.jsx";
import Attendance from "./pages/employee/Attendance.jsx";

// Protected Route
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-white">Loading...</p>; // wait for user to load
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"} replace />;
  }

  return children;
};


export default function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/add-task" element={<ProtectedRoute role="admin"><AddTask /></ProtectedRoute>} />
        <Route path="/admin/view-tasks" element={<ProtectedRoute role="admin"><ViewTasks /></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute role="admin"><Employees /></ProtectedRoute>} />
        <Route path="/admin/view-attendance" element={<ProtectedRoute role="admin"><ViewAttendance /></ProtectedRoute>} />
        <Route path="/admin/view-leaves" element={<ProtectedRoute role="admin"><ViewLeaves /></ProtectedRoute>} />

        {/* Employee */}
        <Route path="/employee/dashboard" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/employee/view-tasks" element={<ProtectedRoute role="employee"><EViewTasks /></ProtectedRoute>} />
        <Route path="/employee/apply-leave" element={<ProtectedRoute role="employee"><ApplyLeave /></ProtectedRoute>} />
        <Route path="/employee/attendance" element={<ProtectedRoute role="employee"><Attendance /></ProtectedRoute>} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}
