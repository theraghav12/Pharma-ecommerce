import jwt from "jsonwebtoken"

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        // Remove "Bearer " if included in the token
        const jwtToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
        console.log("JWT after split:", jwtToken);
        // Verify token
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        
        next();
    } catch (err) {
        console.log("JWT Error: ",err.message);
        return res.status(400).json({ message: "Invalid Token" });
    }
};

export default authenticate;