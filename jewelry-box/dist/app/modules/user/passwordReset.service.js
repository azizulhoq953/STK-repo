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
const user_model_1 = __importDefault(require("../../models/user.model"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_1 = __importDefault(require("../../../config/index"));
class PasswordResetService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: "live.smtp.mailtrap.io", // Use actual host
            port: 2525, // Match the port in .env
            secure: false, // Use `true` for 465, `false` for 2525/587
            auth: {
                user: index_1.default.email.user, // Ensure this matches .env
                pass: index_1.default.email.pass
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find user by email
                const user = yield user_model_1.default.findOne({ email });
                if (!user) {
                    return {
                        success: false,
                        message: 'No user found with this email address'
                    };
                }
                // Generate reset token
                user.generatePasswordReset();
                yield user.save();
                // Create reset URL
                const resetUrl = `${index_1.default.email.frontendUrl}/reset-password?token=${user.resetPassword}`;
                // Email content
                const mailOptions = {
                    from: index_1.default.email.from,
                    to: user.email,
                    subject: 'Password Reset Request',
                    html: `
          <h1>Password Reset Request</h1>
          <p>You are receiving this because you (or someone else) requested a password reset for your account.</p>
          <p>Please click on the following link to complete the process:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `
                };
                yield this.transporter.sendMail(mailOptions);
                return {
                    success: true,
                    message: 'Password reset email has been sent'
                };
            }
            catch (error) {
                console.error("Error sending email:", error); // Log for debugging
                return {
                    success: false,
                    message: 'Error sending password reset email'
                };
            }
        });
    }
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find user by token and check if it's expired
                const user = yield user_model_1.default.findOne({
                    resetPasswordToken: token,
                    resetPasswordExpires: { $gt: Date.now() }
                });
                if (!user) {
                    return {
                        success: false,
                        message: 'Password reset token is invalid or has expired'
                    };
                }
                // Reset password
                yield user.resetPassword(newPassword);
                yield user.save();
                // Send confirmation email
                const mailOptions = {
                    from: index_1.default.email.from,
                    to: user.email,
                    subject: 'Your password has been changed',
                    html: `
          <h1>Password Change Confirmation</h1>
          <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
          <p>If you did not make this change, please contact our support team immediately.</p>
        `
                };
                yield this.transporter.sendMail(mailOptions);
                return {
                    success: true,
                    message: 'Password has been reset successfully'
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error resetting password'
                };
            }
        });
    }
    // Verify reset token validity
    verifyResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({
                    resetPasswordToken: token,
                    resetPasswordExpires: { $gt: Date.now() }
                });
                if (!user) {
                    return {
                        success: false,
                        message: 'Password reset token is invalid or has expired'
                    };
                }
                return {
                    success: true,
                    message: 'Token is valid'
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error verifying reset token'
                };
            }
        });
    }
}
exports.default = new PasswordResetService();
