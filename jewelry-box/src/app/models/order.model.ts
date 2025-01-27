import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: Array<{ productId: mongoose.Types.ObjectId, quantity: number }>;
  totalPrice: number;
  deliveryCharge: number;
  status: "pending" | "progress" | "shipping" | "delivered" | "cancelled";
  paymentMethod: "stripe" | "cashOnDelivery";
  paymentStatus: "pending" | "completed";
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: [
      { productId: { type: mongoose.Types.ObjectId, ref: "Product", required: true }, quantity: { type: Number, required: true } },
    ],
    totalPrice: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    status: { type: String, enum: ["pending", "progress", "shipping", "delivered", "cancelled"], default: "pending" },
    paymentMethod: { type: String, enum: ["stripe", "cashOnDelivery"], required: true },
    paymentStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
