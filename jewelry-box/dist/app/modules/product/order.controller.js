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
exports.OrderController = void 0;
const order_service_1 = require("../product/order.service");
exports.OrderController = {
    createOrder: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const order = yield order_service_1.OrderService.createOrder(req.user.id, req.body);
            res.status(201).json(order);
        }
        catch (error) {
            next(error); // Pass the error to the next middleware
        }
    }),
    viewUserOrders: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orders = yield order_service_1.OrderService.getUserOrders(req.user.id);
            res.status(200).json(orders);
        }
        catch (error) {
            next(error);
        }
    }),
    updateOrderStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedOrder = yield order_service_1.OrderService.updateOrderStatus(id, status);
            res.status(200).json(updatedOrder);
        }
        catch (error) {
            next(error);
        }
    }),
    deleteOrder: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield order_service_1.OrderService.deleteOrder(id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }),
    viewAllOrders: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orders = yield order_service_1.OrderService.getAllOrders();
            res.status(200).json(orders);
        }
        catch (error) {
            next(error);
        }
    }),
};
