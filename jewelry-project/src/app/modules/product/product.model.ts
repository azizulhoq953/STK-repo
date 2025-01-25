//  product.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  details: string;
  inventory: number;
  category: 'Jewelry Box' | 'Leather Box' | 'Cardboard Box' | 'Paper Box' | 'Paper Bag';
  size: string;
  thickness: string;
  color: string;
  minOrderQuantity: number;
  price: number;
  createdBy: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    details: { type: String, required: true },
    inventory: { type: Number, required: true },
    category: { 
      type: String, 
      enum: ['Jewelry Box', 'Leather Box', 'Cardboard Box', 'Paper Box', 'Paper Bag'], 
      required: true 
    },
    size: { type: String, required: true },
    thickness: { type: String, required: true },
    color: { type: String, required: true },
    minOrderQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
