import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import UserModel from "../../models/user.model";
import mongoose from "mongoose";
import dotenv from "dotenv";
import httpStatus from "http-status";
import PaymentModel from "../../models/payment.model";
import OrderModel from "../../models/order.model";
import AppError from "../../../utils/appError"; // Adjust the path as necessary
dotenv.config(); // Make sure .env variables are loaded

interface IPayment {
  transactionId: string;
  client_secret: string;
  status: string;
}

// Stripe initialization with the correct API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia", // Keep the API version as specified
});
export const PaymentController = {
  processPayment: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId } = req.body; // Get orderId from request
      const userId = (req.user as { id: string }).id;

      // Validate order exists
      const order = await OrderModel.findById(orderId);
      if (!order) {
        res.status(404).json({ message: "Order not found." });
        return;
      }

      if (order.paymentStatus === "Completed") {
        res.status(400).json({ message: "Order is already paid." });
        return;
      }

      // Create Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.totalAmount * 100, // Convert to cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          userId: userId,
          orderId: orderId.toString(),
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
  
      if (!sig || !endpointSecret) {
        res.status(400).json({ message: "Missing Stripe signature or webhook secret." });
        return;
      }
  
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhook received:", event.type);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        res.status(400).json({ message: `Webhook Error: ${(err as Error).message}` });
        return;
      }
  
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Payment Intent Succeeded:", paymentIntent.id);
  
        const userId = paymentIntent.metadata.userId;
        const orderId = paymentIntent.metadata.orderId; 
  
        if (!userId || !orderId) {
          console.error("Missing userId or orderId in metadata.");
          res.status(400).json({ message: "Missing metadata in payment intent." });
          return;
        }
  
        // Confirm Order Exists
        const order = await OrderModel.findById(orderId);
        if (!order) {
          console.error("Order not found.");
          res.status(404).json({ message: "Order not found." });
          return;
        }
  
        // Update Payment Record (Ensure paymentIntentId is stored in DB)
        await PaymentModel.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { status: "Completed" },
          { new: true }
        );
  
        // Update Order Payment Status
        const updatePaymentStatus = await OrderModel.findByIdAndUpdate(
          orderId,
          { paymentStatus: "Completed" },
          { new: true }
        );
  
        if (!updatePaymentStatus) {
          console.error("Failed to update order payment status.");
          res.status(500).json({ message: "Order update failed." });
          return;
        }
  
        console.log("✅ Order updated successfully:", updatePaymentStatus);
  
        res.json({ received: true, message: "Payment successful, order updated." });
      } else {
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        res.json({ received: true });
      }
    } catch (error) {
      console.error("Error handling webhook:", error);
      next(error);
    }
  },

  paymentConfirmation: async (payload: IPayment) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payload.transactionId,
    );
    console.log({ paymentIntent });
  
    if (!paymentIntent.amount_received) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Payment failed');
    }
  
    // Update Order Payment Status
    const updatePayment = await OrderModel.findOneAndUpdate(
      { client_secret: payload.client_secret }, // Ensure field matches your schema
      { paymentStatus: payload.status }, // Update payment status
      { new: true },
    );
  
    if (!updatePayment) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Payment not found with provided transactionId',
      );
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
