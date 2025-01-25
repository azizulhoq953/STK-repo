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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
exports.ProductController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield product_service_1.ProductService.create(req.body);
            res.status(201).json(product);
        }
        catch (error) {
            // Cast error to `Error` type to access `message`
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    }),
    findAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const products = yield product_service_1.ProductService.findAll();
            res.status(200).json(products);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield product_service_1.ProductService.update(req.params.id, req.body);
            res.status(200).json(product);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield product_service_1.ProductService.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    }),
};
