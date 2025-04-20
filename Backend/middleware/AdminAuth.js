import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const jwtToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    req.admin = decoded; // Attach decoded admin info to request
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token", error: err.message });
  }
};

export default adminAuth;
