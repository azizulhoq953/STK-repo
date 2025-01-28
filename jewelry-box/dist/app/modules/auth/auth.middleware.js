"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.isAdmin = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided, authorization denied" }); // Send response
        return; // End the middleware execution here
    }
    const secretKey = process.env.JWT_SECRET || "default_secret";
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        console.log("Decoded Token:", decoded);
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    }
    catch (error) {
        console.log("Token verification error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }
    next(); // Proceed to the next middleware or route handler
};
exports.isAdmin = isAdmin;
const generateToken = (userId, role) => {
    const secretKey = process.env.JWT_SECRET || "default_secret";
    return jsonwebtoken_1.default.sign({ id: userId, role }, secretKey, { expiresIn: "1d" });
};
exports.generateToken = generateToken;
