"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided, authorization denied" }); // Send response
        return; // End the middleware execution here
    }
    try {
        const secretKey = process.env.JWT_SECRET || "default_secret";
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.user = decoded; // Attach decoded user info to the request object
        next(); // Proceed to next middleware or route handler
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" }); // Send response
        return; // End the middleware execution here
    }
};
exports.isAuthenticated = isAuthenticated;
