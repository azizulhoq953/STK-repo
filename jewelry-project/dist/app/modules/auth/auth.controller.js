"use strict";
// import { Request, Response, NextFunction } from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import Admin from '../../admin/admin.model'; // Assuming this model exists
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
exports.loginUser = exports.registerAdmin = exports.registerUser = void 0;
const admin_model_1 = __importDefault(require("../../admin/admin.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user already exists
        const existingUser = yield admin_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create new user with default 'user' role
        const newUser = new admin_model_1.default({
            email,
            password: hashedPassword,
            role: 'user'
        });
        yield newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('User registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});
exports.registerUser = registerUser;
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, adminSecret } = req.body;
        // Check admin secret (replace with your own secret verification logic)
        if (adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
            res.status(403).json({ message: 'Invalid admin registration' });
            return;
        }
        // Check if admin already exists
        const existingAdmin = yield admin_model_1.default.findOne({ email, role: 'admin' });
        if (existingAdmin) {
            res.status(400).json({ message: 'Admin already exists' });
            return;
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create new admin
        const newAdmin = new admin_model_1.default({
            email,
            password: hashedPassword,
            role: 'admin'
        });
        yield newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    }
    catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ message: 'Server error during admin registration' });
    }
});
exports.registerAdmin = registerAdmin;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield admin_model_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Check password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Create token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});
exports.loginUser = loginUser;
