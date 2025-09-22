import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ links }) {
  const { logoutUser } = useAuth();

  return (
    <div className="flex flex-col justify-between w-64 bg-black/30 backdrop-blur-md border-r border-emerald-400/30 p-6 min-h-screen">
      {/* Top Navigation Links */}
      <div>
        <h1 className="text-2xl font-bold text-emerald-400 mb-6">Dashboard</h1>
        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `p-3 rounded-lg text-white hover:bg-emerald-500/30 transition ${
                  isActive ? "bg-emerald-500/50 font-bold" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button at Bottom */}
      <div>
        <button
          onClick={logoutUser}
          className="w-full p-3 mt-6 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
