import { Request, Response } from 'express';
import { CartService } from '../cart/cart.service';

export const CartController = {
  addItem: async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    try {
      const cart = await CartService.addItemToCart(req.user._id, productId, quantity);
      res.status(200).json(cart);
    } catch (error: unknown) {
      // Narrowing the type of error
      if (error instanceof Error) {
        // If error is an instance of Error, we can access the message safely
        res.status(400).json({ message: error.message });
      } else {
        // Handle cases where the error is not an instance of Error
        res.status(400).json({ message: "An unknown error occurred" });
      }
    }
  },

  getCart: async (req: Request, res: Response) => {
    try {
      const cart = await CartService.getCart(req.user._id);
      res.status(200).json(cart);
    } catch (error: unknown) {
      // Narrowing the type of error
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "An unknown error occurred" });
      }
    }
  },
};
