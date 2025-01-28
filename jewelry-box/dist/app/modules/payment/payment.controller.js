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
const user_model_1 = __importDefault(require("../../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
const payment_model_1 = __importDefault(require("../../models/payment.model"));
dotenv_1.default.config(); // Make sure .env variables are loaded
// Stripe initialization with the correct API version
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-01-27.acacia", // Keep the API version as specified
});
exports.PaymentController = {
    processPayment: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            // Fetch user and their cart
            const user = yield user_model_1.default.findById(userId).populate("cart.productId");
            if (!user || user.cart.length === 0) {
                res.status(400).json({ message: "Cart is empty or user not found." });
                return;
            }
            // Calculate total amount
            const totalAmount = user.cart.reduce((sum, item) => {
                const product = item.productId;
                return sum + product.price * item.quantity;
            }, 0);
            // Create a payment intent
            const paymentIntent = yield stripe.paymentIntents.create({
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
        }
        catch (error) {
            next(error);
        }
    }),
    handleWebhook: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sig = req.headers["stripe-signature"];
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
            let event;
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            }
            catch (err) {
                const errorMessage = err.message;
                res.status(400).json({ message: `Webhook error: ${errorMessage}` });
                return;
            }
            // Handle the event
            if (event.type === "payment_intent.succeeded") {
                const paymentIntent = event.data.object;
                const userId = paymentIntent.metadata.userId;
                // Clear user cart and save order
                const user = yield user_model_1.default.findById(userId);
                if (user) {
                    user.cart = [];
                    yield user.save();
                }
            }
            res.json({ received: true });
        }
        catch (error) {
            next(error);
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
