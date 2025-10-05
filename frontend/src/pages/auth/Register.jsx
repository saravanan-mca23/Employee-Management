import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "Name is required";
    } else if (form.name.length < 3) {
      errs.name = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(form.name)) {
      errs.name = "Name must only contain letters and spaces";
    }

    if (!form.email) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Invalid email format";
    }

    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    } else if (
      !/(?=.*[a-z])/.test(form.password) ||
      !/(?=.*[A-Z])/.test(form.password) ||
      !/(?=.*[0-9])/.test(form.password) ||
      !/(?=.*[!@#$%^&*])/.test(form.password)
    ) {
      errs.password =
        "Password must include uppercase, lowercase, number, and special character";
    }

    if (!form.role) {
      errs.role = "Role is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
  <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl overflow-hidden shadow-xl">
    
    {/* Left Static Card - Hidden on Mobile */}
    <div className="hidden md:flex flex-1 bg-black/30 backdrop-blur-xl p-12 border-r border-emerald-400/20 flex-col justify-center">
      <h2 className="text-4xl font-bold text-emerald-400 mb-4">
        Employee Management System
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        Welcome! This system allows you to manage tasks, attendance, and
        leaves seamlessly. Use the form on the right to register your account
        and get started.
      </p>
    </div>

    {/* Right Registration Card - Always Visible */}
    <div className="flex-1 bg-black/30 backdrop-blur-xl p-8 sm:p-12 border-l border-emerald-400/20 rounded-3xl md:rounded-tr-3xl md:rounded-br-3xl flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-emerald-400 mb-8 text-center">
        Register
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-2xl bg-black/20 border border-emerald-400/40 placeholder-gray-400 text-white w-full focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-2xl bg-black/20 border border-emerald-400/40 placeholder-gray-400 text-white w-full focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded-2xl bg-black/20 border border-emerald-400/40 placeholder-gray-400 text-white w-full focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="p-3 rounded-2xl bg-black/20 border border-emerald-400/40 text-white w-full focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="p-3 bg-emerald-400 text-black font-bold rounded-2xl hover:bg-emerald-500 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-gray-400 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-400 hover:underline">
          Login
        </Link>
      </p>
    </div>

  </div>
</div>

  );
}
