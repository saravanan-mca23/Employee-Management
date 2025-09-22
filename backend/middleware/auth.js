const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(requiredRole) {
  return (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // decoded should include { id, role, name }
      if (requiredRole && decoded.role !== requiredRole)
        return res.status(403).json({ msg: "Access denied" });
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token invalid or expired" });
    }
  };
}

module.exports = auth;
