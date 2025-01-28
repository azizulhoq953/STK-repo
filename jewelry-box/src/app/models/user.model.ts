import mongoose, { Schema, Document } from "mongoose";

// Define CartItem interface for items in the cart
interface CartItem {
  productId: mongoose.Types.ObjectId; 
  quantity: number;
}
// Extending IUser interface for cart functionality
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  cart: CartItem[];
}

// Define the schema for the user model
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});

// Create the User model from the schema
const UserModel = mongoose.model<IUser>("User", UserSchema);

// Export the model as default
export default UserModel;
