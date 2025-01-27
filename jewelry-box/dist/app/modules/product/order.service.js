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
exports.OrderService = void 0;
const order_model_1 = __importDefault(require("../../models/order.model")); // Your Order Mongoose model
const mongoose_1 = require("mongoose");
exports.OrderService = {
    /**
     * Create a new order
     */
    createOrder: (userId, orderData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { items, totalPrice } = orderData;
            const newOrder = new order_model_1.default({
                user: userId,
                items,
                totalPrice,
                status: "Pending", // Default status when an order is created
            });
            return yield newOrder.save();
        }
        catch (error) { // Explicitly typing `error` as `unknown`
            if (error instanceof Error) {
                throw new Error("Error creating order: " + error.message);
            }
            throw new Error("An unknown error occurred while creating order.");
        }
    }),
    /**
     * Get all orders for a specific user
     */
    getUserOrders: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield order_model_1.default.find({ user: userId }).sort({ createdAt: -1 });
        }
        catch (error) { // Explicitly typing `error` as `unknown`
            if (error instanceof Error) {
                throw new Error("Error fetching user orders: " + error.message);
            }
            throw new Error("An unknown error occurred while fetching user orders.");
        }
    }),
    /**
     * Get all orders (Admin-only)
     */
    getAllOrders: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield order_model_1.default.find().populate("user", "name email").sort({ createdAt: -1 });
        }
        catch (error) { // Explicitly typing `error` as `unknown`
            if (error instanceof Error) {
                throw new Error("Error fetching all orders: " + error.message);
            }
            throw new Error("An unknown error occurred while fetching all orders.");
        }
    }),
    /**
     * Update order status (Admin-only)
     */
    updateOrderStatus: (orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
                throw new Error("Invalid order ID.");
            }
            const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
            if (!validStatuses.includes(status)) {
                throw new Error(`Invalid status. Allowed statuses are: ${validStatuses.join(", ")}`);
            }
            const updatedOrder = yield order_model_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
            if (!updatedOrder) {
                throw new Error("Order not found.");
            }
            return updatedOrder;
        }
        catch (error) { // Explicitly typing `error` as `unknown`
            if (error instanceof Error) {
                throw new Error("Error updating order status: " + error.message);
            }
            throw new Error("An unknown error occurred while updating order status.");
        }
    }),
    /**
     * Delete an order (Admin-only)
     */
    deleteOrder: (orderId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
                throw new Error("Invalid order ID.");
            }
            const deletedOrder = yield order_model_1.default.findByIdAndDelete(orderId);
            if (!deletedOrder) {
                throw new Error("Order not found.");
            }
            return deletedOrder;
        }
        catch (error) { // Explicitly typing `error` as `unknown`
            if (error instanceof Error) {
                throw new Error("Error deleting order: " + error.message);
            }
            throw new Error("An unknown error occurred while deleting the order.");
        }
    }),
};
