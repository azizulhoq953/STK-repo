// types/express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}
