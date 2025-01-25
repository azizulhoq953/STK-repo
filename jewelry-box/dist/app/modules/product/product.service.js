"use strict";
// import { Product } from "./product.types";
// import ProductModel from "../../models/Product";
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
exports.ProductService = void 0;
// export const ProductService = {
//   create: async (productData: Product) => {
//     const product = await ProductModel.create(productData);
//     return product;
//   },
//   findAll: async () => {
//     return await ProductModel.find();
//   },
//   findById: async (id: string) => {
//     return await ProductModel.findById(id);
//   },
//   update: async (id: string, data: Partial<Product>) => {
//     return await ProductModel.findByIdAndUpdate(id, data, { new: true });
//   },
//   delete: async (id: string) => {
//     return await ProductModel.findByIdAndDelete(id);
//   },
// };
const Product_1 = __importDefault(require("../../models/Product")); // Use default import
exports.ProductService = {
    create: (productData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield Product_1.default.create(productData);
            return product;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error("Error creating product: " + error.message);
            }
            else {
                throw new Error("Unknown error occurred while creating product.");
            }
        }
    }),
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const products = yield Product_1.default.find();
            return products;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error("Error fetching products: " + error.message);
            }
            else {
                throw new Error("Unknown error occurred while fetching products.");
            }
        }
    }),
    update: (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedProduct = yield Product_1.default.findByIdAndUpdate(id, updateData, { new: true });
            return updatedProduct;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error("Error updating product: " + error.message);
            }
            else {
                throw new Error("Unknown error occurred while updating product.");
            }
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Product_1.default.findByIdAndDelete(id);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error("Error deleting product: " + error.message);
            }
            else {
                throw new Error("Unknown error occurred while deleting product.");
            }
        }
    }),
};
