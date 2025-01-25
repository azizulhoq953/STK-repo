import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../user/user.model';

interface IUserRequest extends Request {
  user?: { id: string; email: string; role?: string };  // Define user in the request
}

export const authMiddleware = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };

    // Use the Types.ObjectId to find user
    const user: IUser | null = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Assign user details to the request object
    req.user = {
      id: user._id.toString(),  // Convert ObjectId to string
      email: user.email,
      role: user.role,  // Role can be optional
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token or user not found' });
  }
};
