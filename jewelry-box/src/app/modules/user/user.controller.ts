// user.controller.ts 
import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { CartService } from "../product/cart.service";
// import { OrderService } from "../product/order.service";

export const UserController = {
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ name, email, password: hashedPassword });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error); // Pass error to middleware
    }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId,email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Login successful" ,token });
    } catch (error) {
      next(error); // Pass error to middleware
    }
  },
};