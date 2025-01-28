import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import UserModel from "../../models/user.model";
import mongoose from "mongoose";
import dotenv from "dotenv";
import PaymentModel from "../../models/payment.model";
dotenv.config(); // Make sure .env variables are loaded

// Stripe initialization with the correct API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia", // Keep the API version as specified
});
export const PaymentController = {
  processPayment: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as { id: string }).id;

      // Fetch user and their cart
      const user = await UserModel.findById(userId).populate("cart.productId");
      if (!user || user.cart.length === 0) {
        res.status(400).json({ message: "Cart is empty or user not found." });
        return;
      }

      // Calculate total amount
      const totalAmount = user.cart.reduce((sum, item) => {
        const product = item.productId as unknown as { price: number };
        return sum + product.price * item.quantity;
      }, 0);

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, // Convert to cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          userId: userId,
        },
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: "Payment intent created successfully.",
      });
    } catch (error) {
      next(error);
    }
  },

  handleWebhook: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sig = req.headers["stripe-signature"];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret as string);
      } catch (err) {
        const errorMessage = (err as Error).message;
        res.status(400).json({ message: `Webhook error: ${errorMessage}` });
        return;
      }

      // Handle the event
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata.userId;

        // Clear user cart and save order
        const user = await UserModel.findById(userId);
        if (user) {
          user.cart = [];
          await user.save();
        }
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  },
  // Admin Route to View All Payments
  viewPayments: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Ensure only admin can access
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      // Fetch all payments made by users
      const payments = await PaymentModel.find().populate('userId');
      if (!payments) {
        res.status(404).json({ message: "No payments found." });
        return;
      }

      res.status(200).json({
        payments,
        message: "Payments fetched successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
};
