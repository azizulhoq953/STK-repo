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
exports.OrderController = void 0;
const order_model_1 = __importDefault(require("../../models/order.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
exports.OrderController = {
    placeOrder: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const user = yield user_model_1.default.findById(userId).populate("cart.productId");
            if (!user || user.cart.length === 0) {
                res.status(400).json({ message: "Cart is empty or user not found." });
                return;
            }
            const totalAmount = user.cart.reduce((sum, item) => {
                const product = item.productId;
                return sum + product.price * item.quantity;
            }, 0);
            const newOrder = new order_model_1.default({
                userId,
                items: user.cart.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
                totalAmount,
            });
            yield newOrder.save();
            // Clear the cart after placing the order
            user.cart = [];
            yield user.save();
            res.status(201).json({ message: "Order placed successfully.", order: newOrder });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllOrders: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orders = yield order_model_1.default.find().populate("userId items.productId");
            res.status(200).json({ orders });
        }
        catch (error) {
            next(error);
        }
    }),
    getOrderStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const orders = yield order_model_1.default.find({ userId }).populate("items.productId");
            res.status(200).json({ orders });
        }
        catch (error) {
            next(error);
        }
    }),
    updateOrderStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { orderId, status } = req.body;
            const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
            if (!validStatuses.includes(status)) {
                res.status(400).json({ message: "Invalid order status." });
                return;
            }
            const order = yield order_model_1.default.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
            if (!order) {
                res.status(404).json({ message: "Order not found." });
                return;
            }
            res.status(200).json({ message: "Order status updated successfully.", order });
        }
        catch (error) {
            next(error);
        }
    }),
    deleteOrder: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { orderId } = req.body;
            const order = yield order_model_1.default.findByIdAndDelete(orderId);
            if (!order) {
                res.status(404).json({ message: "Order not found." });
                return;
            }
            res.status(200).json({ message: "Order deleted successfully." });
        }
        catch (error) {
            next(error);
        }
    }),
};
