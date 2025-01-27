import { Request, Response } from 'express';
import { OrderService } from './order.service';

export const OrderController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      const order = await OrderService.createOrder(req.user._id);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getOrderStatus: async (req: Request, res: Response) => {
    const { orderId } = req.params;
    try {
      const order = await OrderService.getOrderStatus(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateOrderStatus: async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
      const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
