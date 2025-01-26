import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const token = (req.headers as Record<string, string>)['authorization']?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided, authorization denied" }); // Send response
    return; // End the middleware execution here
  }

  try {
    const secretKey = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token" }); // Send response
    return; // End the middleware execution here
  }
};
