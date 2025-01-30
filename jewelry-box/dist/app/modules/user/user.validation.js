"use strict";
// src/app/modules/user/user.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidations = void 0;
const zod_1 = require("zod");
exports.passwordValidations = {
    forgotPasswordSchema: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string({
                required_error: "Email is required"
            }).email('Invalid email format')
        })
    }),
    resetPasswordSchema: zod_1.z.object({
        body: zod_1.z.object({
            token: zod_1.z.string({
                required_error: "Reset token is required"
            }).min(1, 'Reset token is required'),
            newPassword: zod_1.z.string({
                required_error: "New password is required"
            }).min(6, 'Password must be at least 6 characters')
                .max(32, 'Password cannot exceed 32 characters')
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
            confirmPassword: zod_1.z.string({
                required_error: "Password confirmation is required"
            })
        }).refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords don't match",
            path: ["confirmPassword"]
        })
    }),
    verifyTokenSchema: zod_1.z.object({
        params: zod_1.z.object({
            token: zod_1.z.string({
                required_error: "Token is required"
            }).min(1, 'Token is required')
        })
    })
};
exports.default = exports.passwordValidations;
