"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_config_1 = require("./config/db.config");
const product_routes_1 = __importDefault(require("./app/modules/product/product.routes"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./app/modules/user/user.routes"));
const order_routes_1 = __importDefault(require("./app/modules/order/order.routes"));
const routes_2 = __importDefault(require("./app/modules/payment/routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const payment_controller_1 = require("./app/modules/payment/payment.controller");
const adminProfile_routes_1 = __importDefault(require("./app/modules/admin/adminProfile.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/api", routes_1.default);
app.use("/api", order_routes_1.default);
// app.use("/api/users", userRoutes);
app.use("/api/auth/users", user_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/payment", routes_2.default);
app.use("/api", admin_routes_1.default);
app.use("/api", adminProfile_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.post("/api/payments/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.PaymentController.handleWebhook);
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});
(0, db_config_1.connectDB)();
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});
exports.default = app;
