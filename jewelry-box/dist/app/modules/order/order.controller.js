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
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderStatus = exports.getAllOrders = exports.placeOrder = exports.OrderController = void 0;
const order_model_1 = __importDefault(require("../../models/order.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.OrderController = {
    placeOrder: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            // Fetch user cart
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
            // Create new order with "Pending" payment status
            const newOrder = new order_model_1.default({
                userId,
                items: user.cart.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
                totalAmount,
                paymentStatus: "Pending",
            });
            yield newOrder.save();
            res.status(201).json({
                message: "Order placed successfully. Proceed to payment.",
                orderId: newOrder._id,
                totalAmount,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getAllOrders: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("🔍 Fetching Orders..."); // Debugging log
            const orders = yield order_model_1.default.find().populate("userId items.productId").lean();
            console.log("🔹 Orders Found:", orders.length); // Debugging log
            if (!orders || orders.length === 0) {
                res.status(404).json({ message: "No orders found." });
                return;
            }
            res.status(200).json({ orders });
        }
        catch (error) {
            console.error("❌ Error Fetching Orders:", error); // Debugging log
            next(error);
        }
    }),
    getOrderStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const orders = yield order_model_1.default.find({ userId })
                .populate("items.productId")
                .select("items totalAmount paymentStatus orderStatus createdAt");
            res.status(200).json({ orders });
        }
        catch (error) {
            next(error);
        }
    }),
    updateOrderStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { orderId, status } = req.body;
            console.log("🔍 Updating Order:", { orderId, status });
            if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
                res.status(400).json({ message: "Invalid order ID format." });
                return;
            }
            const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
            if (!validStatuses.includes(status)) {
                res.status(400).json({ message: "Invalid order status." });
                return;
            }
            const order = yield order_model_1.default.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
            if (!order) {
                console.error("❌ Order Not Found");
                res.status(404).json({ message: "Order not found." });
                return;
            }
            console.log("✅ Order Updated:", order);
            res.status(200).json({ message: "Order status updated successfully.", order });
        }
        catch (error) {
            console.error("❌ Error Updating Order:", error);
            next(error);
        }
    }),
    deleteOrder: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { orderId } = req.params;
            console.log("🗑️ Attempting to delete Order:", orderId);
            // Validate orderId format
            if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
                console.error("❌ Invalid Order ID Format:", orderId);
                res.status(400).json({ message: "Invalid order ID format." });
                return;
            }
            // First find the order to make sure it exists
            const existingOrder = yield order_model_1.default.findById(orderId);
            if (!existingOrder) {
                console.error("❌ Order Not Found:", orderId);
                res.status(404).json({ message: "Order not found." });
                return;
            }
            // Perform the deletion
            const deletedOrder = yield order_model_1.default.findByIdAndDelete(orderId);
            if (!deletedOrder) {
                console.error("❌ Error During Order Deletion");
                res.status(500).json({ message: "Error deleting order." });
                return;
            }
            console.log("✅ Order Successfully Deleted:", deletedOrder);
            res.status(200).json({
                message: "Order deleted successfully.",
                deletedOrder: {
                    id: deletedOrder._id,
                    items: deletedOrder.items,
                    totalAmount: deletedOrder.totalAmount,
                    createdAt: deletedOrder.createdAt
                }
            });
        }
        catch (error) {
            console.error("❌ Error in Delete Operation:", error);
            next(error);
        }
    }),
};
exports.placeOrder = exports.OrderController.placeOrder, exports.getAllOrders = exports.OrderController.getAllOrders, exports.getOrderStatus = exports.OrderController.getOrderStatus, exports.updateOrderStatus = exports.OrderController.updateOrderStatus, exports.deleteOrder = exports.OrderController.deleteOrder;
