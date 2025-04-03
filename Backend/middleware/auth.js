const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        // Remove "Bearer " if included in the token
        const jwtToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

        // Verify token
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authenticate;
