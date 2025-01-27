import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model'; // Assuming User model is defined already
import { IProduct } from './Product'; // Assuming Product model is defined

interface ICartItem {
  product: IProduct['_id'];
  quantity: number;
}

interface ICart extends Document {
  user: IUser['_id'];
  items: ICartItem[];
  totalAmount: number;
}

const CartSchema = new Schema<ICart>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
});

export default mongoose.model<ICart>('Cart', CartSchema);
