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
exports.getProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("./product.model"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('Reached createProduct controller'); // Log to confirm execution
    try {
        const { name, details, inventory, category, size, thickness, color, minOrderQuantity, price } = req.body;
        const createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!name || !details || !inventory || !category || !size || !thickness || !color || !minOrderQuantity || !price || !createdBy) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const product = new product_model_1.default({
            name,
            details,
            inventory,
            category,
            size,
            thickness,
            color,
            minOrderQuantity,
            price,
            createdBy,
        });
        const savedProduct = yield product.save();
        res.status(201).json({
            message: 'Product created successfully',
            product: savedProduct,
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, minPrice, maxPrice, color } = req.query;
        // Build query object dynamically
        const query = {};
        if (category)
            query.category = category;
        if (color)
            query.color = color;
        if (minPrice)
            query.price = Object.assign(Object.assign({}, query.price), { $gte: Number(minPrice) }); // Greater than or equal to minPrice
        if (maxPrice)
            query.price = Object.assign(Object.assign({}, query.price), { $lte: Number(maxPrice) }); // Less than or equal to maxPrice
        // Fetch products based on the query
        const products = yield product_model_1.default.find(query);
        res.status(200).json({
            message: 'Products retrieved successfully',
            products,
        });
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
exports.getProducts = getProducts;
