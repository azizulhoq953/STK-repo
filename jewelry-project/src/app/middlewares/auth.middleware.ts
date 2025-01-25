// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return;
    }

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role }; // Attach user info to the request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// // Extend the Request interface to include user property
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         email: string;
//         role: string;
//       };
//     }
//   }
// }

// export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
//   const authHeader = req.headers.authorization;
  
//   if (!authHeader) {
//     res.status(401).json({ error: 'Unauthorized: No token provided' });
//     return;
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     // Ensure JWT_SECRET is defined
//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//       console.error('JWT_SECRET is not defined');
//       res.status(500).json({ error: 'Server configuration error' });
//       return;
//     }

//     const decoded = jwt.verify(token, secret) as {
//       id: string;
//       email: string;
//       role: string;
//     };

//     // Explicitly check role
//     if (decoded.role !== 'admin') {
//       res.status(403).json({ error: 'Forbidden: Admin access required' });
//       return;
//     }

//     // Attach user information to request
//     req.user = {
//       id: decoded.id,
//       email: decoded.email,
//       role: decoded.role
//     };

//     next();
//   } catch (error) {
//     console.error('Token verification error:', error);
    
//     if (error instanceof jwt.TokenExpiredError) {
//       res.status(401).json({ error: 'Unauthorized: Token expired' });
//     } else if (error instanceof jwt.JsonWebTokenError) {
//       res.status(401).json({ error: 'Unauthorized: Invalid token' });
//     } else {
//       res.status(500).json({ error: 'Internal server error during token verification' });
//     }
//   }
// };