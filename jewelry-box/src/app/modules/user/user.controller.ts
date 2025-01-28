// user.controller.ts 
import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ProductModel from "../../models/Product";

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


addToCart: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string }).id;
    console.log("User ID from token:", userId);

    const { products } = req.body;
    console.log("Products received in request:", products);

    if (!products || !Array.isArray(products) || products.length === 0) {
      res.status(400).json({ message: "Products array is required and cannot be empty." });
      return;
    }

    for (const { productId, quantity } of products) {
      if (!mongoose.Types.ObjectId.isValid(productId) || typeof quantity !== "number" || quantity < 1) {
        res.status(400).json({ message: "Invalid productId or quantity." });
        return;
      }

      const product = await ProductModel.findById(productId);
      if (!product) {
        res.status(404).json({ message: `Product with ID ${productId} not found.` });
        return;
      }
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    console.log("User cart before update:", user.cart);

    products.forEach(({ productId, quantity }: { productId: string; quantity: number }) => {
      const existingItem = user.cart.find((item) => item.productId.equals(productId));
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        user.cart.push({ productId: new mongoose.Types.ObjectId(productId), quantity });
      }
    });

    console.log("User cart after update:", user.cart);

    await user.save();
    console.log("User cart saved to database.");

    res.status(200).json({ message: "Cart updated successfully.", cart: user.cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
},

getCart: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string }).id;
    console.log("User ID from token:", userId);

    const user = await UserModel.findById(userId).populate("cart.productId");
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json(user.cart);
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
},

updateCart: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string }).id; // Extract user ID from token
    const { productId, quantity } = req.body;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(productId) || typeof quantity !== "number" || quantity < 1) {
      res.status(400).json({ message: "Invalid productId or quantity." });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Find the cart item to update
    const cartItem = user.cart.find((item) => item.productId.equals(productId));
    if (!cartItem) {
      res.status(404).json({ message: "Product not found in cart." });
      return;
    }

    // Update the quantity
    cartItem.quantity = quantity;

    await user.save();

    res.status(200).json({ message: "Cart item updated successfully.", cart: user.cart });
  } catch (error) {
    next(error); // Pass errors to global error handler
  }
},


deleteCartItem: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string }).id; // Extract user ID from token
    const { productId } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: "Invalid productId." });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Filter out the product to delete
    const initialCartLength = user.cart.length;
    user.cart = user.cart.filter((item) => !item.productId.equals(productId));

    // Check if the product was actually removed
    if (user.cart.length === initialCartLength) {
      res.status(404).json({ message: "Product not found in cart." });
      return;
    }

    await user.save();

    res.status(200).json({ message: "Cart item deleted successfully.", cart: user.cart });
  } catch (error) {
    next(error); // Pass errors to global error handler
  }
},


};


