import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Asyncly from "../utils/Asyncly.js";
import User from "../models/userModel.js";

const { Types } = mongoose;

/**
 * Middleware used to protect routes from unauthorized users
 */
 export const isAuthenticated = Asyncly(async (req, res, next) => {
    let token;
  
    const secret = process.env.JWT_SECRET;
  
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1];
  
        const decoded = jwt.verify(token, secret);
  
        if (typeof decoded === 'object' && 'userId' in decoded && 'isAdmin' in decoded) {
          const user = await User.findById(decoded.id).select("-password");
  
          if (!user) {
            res.status(401);
            throw new Error("User not found");
          }
  
          req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          };
  
          next();
        } else {
          res.status(401);
          throw new Error("Invalid token format or user ID");
        }
      } catch (error) {
        console.error('Error decoding token:', error.message);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
  
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });
  
/**
 * Middleware used to protect routes from users who are not flagged as admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

