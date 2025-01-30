import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import User from "../../models/user.model";
import { NextFunction } from "express";
export const AuthController = {
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      const result = await AuthService.authenticate(username, password);
      res.status(200).json(result);
    } catch (error) {
      // Safely handle the `error` type
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(401).json({ error: errorMessage });
    }
  },
};

// exports.forgotPassword = async (req: { body: { email: any; }; }, res: any, next: (arg0: Error) => void) => {
//   //get user based on posted email
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     const error = new Error('There is no user with email address');
//     return next(error);
//   }

//   //generate random reset token
//   const resetToken = user.passwordResetToken;
//   await user.save();
// }



// export const resetPassword = (req: Request, res: Response, next: NextFunction) => {

// }