"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_1 = __importDefault(require("http-status"));
const payment_model_1 = __importDefault(require("../../models/payment.model"));
const order_model_1 = __importDefault(require("../../models/order.model"));
const appError_1 = __importDefault(require("../../../utils/appError")); // Adjust the path as necessary
dotenv_1.default.config(); // Make sure .env variables are loaded
// Stripe initialization with the correct API version
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-01-27.acacia", // Keep the API version as specified
});
exports.PaymentController = {
    processPayment: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { orderId } = req.body; // Get orderId from request
            const userId = req.user.id;
            // Validate order exists
            const order = yield order_model_1.default.findById(orderId);
            if (!order) {
                res.status(404).json({ message: "Order not found." });
                return;
            }
            if (order.paymentStatus === "Completed") {
                res.status(400).json({ message: "Order is already paid." });
                return;
            }
            // Create Stripe Payment Intent
            const paymentIntent = yield stripe.paymentIntents.create({
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
        }
        catch (error) {
            next(error);
        }
    }),
    handleWebhook: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sig = req.headers["stripe-signature"];
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
            if (!sig || !endpointSecret) {
                res.status(400).json({ message: "Missing Stripe signature or webhook secret." });
                return;
            }
            let event;
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
                console.log("Webhook received:", event.type);
            }
            catch (err) {
                console.error("Webhook signature verification failed:", err);
                res.status(400).json({ message: `Webhook Error: ${err.message}` });
                return;
            }
            if (event.type === "payment_intent.succeeded") {
                const paymentIntent = event.data.object;
                console.log("✅ Payment Intent Succeeded:", paymentIntent.id);
                const userId = paymentIntent.metadata.userId;
                const orderId = paymentIntent.metadata.orderId;
                if (!userId || !orderId) {
                    console.error("Missing userId or orderId in metadata.");
                    res.status(400).json({ message: "Missing metadata in payment intent." });
                    return;
                }
                // Confirm Order Exists
                const order = yield order_model_1.default.findById(orderId);
                if (!order) {
                    console.error("Order not found.");
                    res.status(404).json({ message: "Order not found." });
                    return;
                }
                // Update Payment Record (Ensure paymentIntentId is stored in DB)
                yield payment_model_1.default.findOneAndUpdate({ paymentIntentId: paymentIntent.id }, { status: "Completed" }, { new: true });
                // Update Order Payment Status
                const updatePaymentStatus = yield order_model_1.default.findByIdAndUpdate(orderId, { paymentStatus: "Completed" }, { new: true });
                if (!updatePaymentStatus) {
                    console.error("Failed to update order payment status.");
                    res.status(500).json({ message: "Order update failed." });
                    return;
                }
                console.log("✅ Order updated successfully:", updatePaymentStatus);
                res.json({ received: true, message: "Payment successful, order updated." });
            }
            else {
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
                res.json({ received: true });
            }
        }
        catch (error) {
            console.error("Error handling webhook:", error);
            next(error);
        }
    }),
    paymentConfirmation: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const paymentIntent = yield stripe.paymentIntents.retrieve(payload.transactionId);
        console.log({ paymentIntent });
        if (!paymentIntent.amount_received) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Payment failed');
        }
        // Update Order Payment Status
        const updatePayment = yield order_model_1.default.findOneAndUpdate({ client_secret: payload.client_secret }, // Ensure field matches your schema
        { paymentStatus: payload.status }, // Update payment status
        { new: true });
        if (!updatePayment) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Payment not found with provided transactionId');
        }
    }),
    // Admin Route to View All Payments
    viewPayments: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Ensure only admin can access
            if (!req.user || req.user.role !== 'admin') {
                res.status(403).json({ message: "Access denied" });
                return;
            }
            // Fetch all payments made by users
            const payments = yield payment_model_1.default.find().populate('userId');
            if (!payments) {
                res.status(404).json({ message: "No payments found." });
                return;
            }
            res.status(200).json({
                payments,
                message: "Payments fetched successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
