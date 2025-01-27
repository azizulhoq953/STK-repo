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
exports.PaymentController = void 0;
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc', {
    apiVersion: '2024-12-18.acacia',
});
exports.PaymentController = {
    /**
     * Create Payment Intent (For a simple payment process)
     */
    createPayment: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { amount, currency } = req.body;
            // Create a Payment Intent
            const paymentIntent = yield stripe.paymentIntents.create({
                amount,
                currency,
            });
            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        }
        catch (error) {
            next(error);
        }
    }),
};
