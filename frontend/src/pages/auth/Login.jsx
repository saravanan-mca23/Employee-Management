import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation function
  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) errs.email = "Email is required";
    else if (!emailRegex.test(email)) errs.email = "Invalid email format";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const role = await loginUser(email, password);
      navigate(role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="flex w-full max-w-5xl rounded-3xl overflow-hidden shadow-xl">

        {/* Left Static Panel */}
        <div className="flex-1 bg-black/30 backdrop-blur-xl p-12 border-r border-emerald-400/20 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-emerald-400 mb-4">Employee Management System</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Welcome back! Enter your credentials to access your dashboard, manage tasks, attendance, and leaves.
          </p>
        </div>

        {/* Right Login Form */}
        <div className="flex-1 bg-black/30 backdrop-blur-xl p-12 border-l border-emerald-400/20 rounded-tr-3xl rounded-br-3xl">
          <h2 className="text-3xl font-bold text-emerald-400 mb-8 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded-2xl bg-black/20 border border-emerald-400/40 placeholder-gray-400 text-white w-full focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded-2xl bg-black/20 border border-emerald-400/40 placeholder-gray-400 text-white w-full focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="p-3 bg-emerald-400 text-black font-bold rounded-2xl hover:bg-emerald-500 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-gray-400 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-400 hover:underline">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
