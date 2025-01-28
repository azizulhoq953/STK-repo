import { Request, Response, NextFunction } from "express";
import OrderModel from "../../models/order.model";
import UserModel from "../../models/user.model";
import mongoose from "mongoose";

export const OrderController = {
  placeOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as { id: string }).id;

      const user = await UserModel.findById(userId).populate("cart.productId");
      if (!user || user.cart.length === 0) {
        res.status(400).json({ message: "Cart is empty or user not found." });
        return;
      }

      const totalAmount = user.cart.reduce((sum, item) => {
        const product = item.productId as unknown as { price: number };
        return sum + product.price * item.quantity;
      }, 0);

      const newOrder = new OrderModel({
        userId,
        items: user.cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        totalAmount,
      });

      await newOrder.save();

      // Clear the cart after placing the order
      user.cart = [];
      await user.save();

      res.status(201).json({ message: "Order placed successfully.", order: newOrder });
    } catch (error) {
      next(error);
    }
  },

  getAllOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await OrderModel.find().populate("userId items.productId");
      res.status(200).json({ orders });
    } catch (error) {
      next(error);
    }
  },

  getOrderStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as { id: string }).id;
      const orders = await OrderModel.find({ userId }).populate("items.productId");
      res.status(200).json({ orders });
    } catch (error) {
      next(error);
    }
  },
  
  updateOrderStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId, status } = req.body;
  
      const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid order status." });
        return;
      }
  
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { orderStatus: status },
        { new: true }
      );
  
      if (!order) {
        res.status(404).json({ message: "Order not found." });
        return;
      }
  
      res.status(200).json({ message: "Order status updated successfully.", order });
    } catch (error) {
      next(error);
    }
  },

  deleteOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId } = req.body;
  
      const order = await OrderModel.findByIdAndDelete(orderId);
  
      if (!order) {
        res.status(404).json({ message: "Order not found." });
        return;
      }
  
      res.status(200).json({ message: "Order deleted successfully." });
    } catch (error) {
      next(error);
    }
  },  
  
  
};
