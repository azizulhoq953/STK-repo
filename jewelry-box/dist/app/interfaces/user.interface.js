"use strict";
// Add these to your config.ts or config/index.ts file
Object.defineProperty(exports, "__esModule", { value: true });
// Example config implementation
const config = {
    // ... your existing config ...
    emailService: process.env.EMAIL_SERVICE || 'gmail',
    emailUser: process.env.EMAIL_USER || '',
    emailPassword: process.env.EMAIL_PASSWORD || '',
    emailFrom: process.env.EMAIL_FROM || 'noreply@yourapp.com',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};
exports.default = config;
