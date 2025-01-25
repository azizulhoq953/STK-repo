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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminData = {
    username: "admin",
    password: bcrypt_1.default.hashSync("admin123", 10), // Predefined hashed password
};
exports.AuthService = {
    authenticate: (username, password) => __awaiter(void 0, void 0, void 0, function* () {
        if (username === adminData.username && bcrypt_1.default.compareSync(password, adminData.password)) {
            const token = jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET || "secret", {
                expiresIn: "1d",
            });
            return { token };
        }
        throw new Error("Invalid credentials");
    }),
};
