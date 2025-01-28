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
exports.UserController = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../../models/Product"));
// import { CartService } from "../product/cart.service";
// import { OrderService } from "../product/order.service";
exports.UserController = {
    register: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            const existingUser = yield user_model_1.default.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = new user_model_1.default({ name, email, password: hashedPassword });
            yield newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        }
        catch (error) {
            next(error); // Pass error to middleware
        }
    }),
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, email, password } = req.body;
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                res.status(400).json({ message: "Invalid credentials" });
                return;
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: "Invalid credentials" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "default_secret", {
                expiresIn: "1h",
            });
            res.status(200).json({ message: "Login successful", token });
        }
        catch (error) {
            next(error); // Pass error to middleware
        }
    }),
    addToCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            console.log("User ID from token:", userId);
            const { products } = req.body;
            console.log("Products received in request:", products);
            if (!products || !Array.isArray(products) || products.length === 0) {
                res.status(400).json({ message: "Products array is required and cannot be empty." });
                return;
            }
            for (const { productId, quantity } of products) {
                if (!mongoose_1.default.Types.ObjectId.isValid(productId) || typeof quantity !== "number" || quantity < 1) {
                    res.status(400).json({ message: "Invalid productId or quantity." });
                    return;
                }
                const product = yield Product_1.default.findById(productId);
                if (!product) {
                    res.status(404).json({ message: `Product with ID ${productId} not found.` });
                    return;
                }
            }
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            console.log("User cart before update:", user.cart);
            products.forEach(({ productId, quantity }) => {
                const existingItem = user.cart.find((item) => item.productId.equals(productId));
                if (existingItem) {
                    existingItem.quantity += quantity;
                }
                else {
                    user.cart.push({ productId: new mongoose_1.default.Types.ObjectId(productId), quantity });
                }
            });
            console.log("User cart after update:", user.cart);
            yield user.save();
            console.log("User cart saved to database.");
            res.status(200).json({ message: "Cart updated successfully.", cart: user.cart });
        }
        catch (error) {
            console.error("Error in addToCart:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }),
    getCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            console.log("User ID from token:", userId);
            const user = yield user_model_1.default.findById(userId).populate("cart.productId");
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.status(200).json(user.cart);
        }
        catch (error) {
            console.error("Error in getCart:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }),
    updateCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id; // Extract user ID from token
            const { productId, quantity } = req.body;
            // Validate inputs
            if (!mongoose_1.default.Types.ObjectId.isValid(productId) || typeof quantity !== "number" || quantity < 1) {
                res.status(400).json({ message: "Invalid productId or quantity." });
                return;
            }
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            // Find the cart item to update
            const cartItem = user.cart.find((item) => item.productId.equals(productId));
            if (!cartItem) {
                res.status(404).json({ message: "Product not found in cart." });
                return;
            }
            // Update the quantity
            cartItem.quantity = quantity;
            yield user.save();
            res.status(200).json({ message: "Cart item updated successfully.", cart: user.cart });
        }
        catch (error) {
            next(error); // Pass errors to global error handler
        }
    }),
    deleteCartItem: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id; // Extract user ID from token
            const { productId } = req.body;
            // Validate input
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                res.status(400).json({ message: "Invalid productId." });
                return;
            }
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            // Filter out the product to delete
            const initialCartLength = user.cart.length;
            user.cart = user.cart.filter((item) => !item.productId.equals(productId));
            // Check if the product was actually removed
            if (user.cart.length === initialCartLength) {
                res.status(404).json({ message: "Product not found in cart." });
                return;
            }
            yield user.save();
            res.status(200).json({ message: "Cart item deleted successfully.", cart: user.cart });
        }
        catch (error) {
            next(error); // Pass errors to global error handler
        }
    }),
};
