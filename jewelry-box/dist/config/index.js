"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    ip_address: process.env.IP_ADDRESS,
    database_url: process.env.DATABASE_URL,
    node_env: process.env.NODE_ENV,
    port: process.env.PORTS,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        jwt_expire_in: process.env.JWT_EXPIRE_IN,
    },
    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || '',
        from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    },
    super_admin: {
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD,
    },
};
