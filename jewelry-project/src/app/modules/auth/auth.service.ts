// auth.service.ts
import jwt from 'jsonwebtoken';
// import { IAdmin } from '../../admin/admin.model';
import bcrypt from 'bcryptjs';

export const generateToken = (adminId: string) => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });
};

export const comparePasswords = async (enteredPassword: string, storedPassword: string) => {
  return bcrypt.compare(enteredPassword, storedPassword);
};
