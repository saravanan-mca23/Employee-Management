import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // add loading state
  const navigate = useNavigate();

 const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);

  // ✅ Save full user object instead of only role
  setUser(res.data.user || { 
    name: res.data.name, 
    email: res.data.email, 
    role: res.data.role 
  });

  return res.data.role;
};


  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get("/auth/profile"); // fetch full profile
        setUser(res.data); 
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
