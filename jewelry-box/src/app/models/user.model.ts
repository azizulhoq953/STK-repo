import mongoose, { Schema, Document } from "mongoose";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Extend the interface to include reset token fields
interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  password: string;
  cart: CartItem[];
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  
  // Method declarations
  generatePasswordReset(): void;
  resetPassword(password: string): Promise<void>;
}

interface CartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  businessName: { type: String, required: true },
  password: { type: String, required: true },
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],
 passwordChangedAt: Date,
 passwordResetToken: String,
 passwordResetTokenExpires: Date,
});

// Generate password reset token
UserSchema.methods.generatePasswordReset = function() {  // ✅ Rename the function
  // Generate a random token and hash it
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 100; // 10 minutes
  console.log(resetToken, this.passwordResetToken);

  return resetToken;
};

// Reset password
UserSchema.methods.resetPassword = async function(password: string) {
  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
  
  // Clear reset token fields
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

// Add pre-save hook to hash password when modified
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;