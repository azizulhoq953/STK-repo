import UserModel from '../../models/user.model';
import nodemailer from 'nodemailer';
import config from '../../../config/index';

class PasswordResetService {
  private transporter: nodemailer.Transporter;

  constructor() {
this.transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",  // Use actual host
  port: 2525,                     // Match the port in .env
  secure: false,                   // Use `true` for 465, `false` for 2525/587
  auth: {
    user: config.email.user,       // Ensure this matches .env
    pass: config.email.pass
  }
});
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'No user found with this email address'
        };
      }
  
      // Generate reset token
      user.generatePasswordReset();
      await user.save();
  
      // Create reset URL
      const resetUrl = `${config.email.frontendUrl}/reset-password?token=${user.resetPassword}`;
  
      // Email content
      const mailOptions = {
        from: config.email.from,
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
  
      await this.transporter.sendMail(mailOptions);
  
      return {
        success: true,
        message: 'Password reset email has been sent'
      };
  
    } catch (error) {
      console.error("Error sending email:", error); // Log for debugging
  
      return {
        success: false,
        message: 'Error sending password reset email'
      };
    }
  }
  

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find user by token and check if it's expired
      const user = await UserModel.findOne({
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
      await user.resetPassword(newPassword);
      await user.save();

      // Send confirmation email
      const mailOptions = {
        from: config.email.from,
        to: user.email,
        subject: 'Your password has been changed',
        html: `
          <h1>Password Change Confirmation</h1>
          <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
          <p>If you did not make this change, please contact our support team immediately.</p>
        `
      };

      await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Password has been reset successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Error resetting password'
      };
    }
  }

  // Verify reset token validity
  async verifyResetToken(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await UserModel.findOne({
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

    } catch (error) {
      return {
        success: false,
        message: 'Error verifying reset token'
      };
    }
  }
}

export default new PasswordResetService();