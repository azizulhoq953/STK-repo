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
exports.comparePasswords = exports.generateToken = void 0;
// auth.service.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { IAdmin } from '../../admin/admin.model';
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken = (adminId) => {
    return jsonwebtoken_1.default.sign({ adminId }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h',
    });
};
exports.generateToken = generateToken;
const comparePasswords = (enteredPassword, storedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcryptjs_1.default.compare(enteredPassword, storedPassword);
});
exports.comparePasswords = comparePasswords;
