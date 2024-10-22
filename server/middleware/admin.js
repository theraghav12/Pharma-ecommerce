const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      // If the user is an admin, allow them to proceed
      next();
    } else {
      // If not, deny access
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
  };
  
  export default adminMiddleware;
  