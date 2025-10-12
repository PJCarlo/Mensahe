import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // Check if no token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    
    // check if the token is stll valid after the given time
    const decoded = jwt.verify(token, process.env.JWT_SECRETS_ACCESS);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Find user by ID from token payload if token is valid it attach user to request object and proceed to next middleware
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    } else {
      req.user = user;
      next();
    }

  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

}
