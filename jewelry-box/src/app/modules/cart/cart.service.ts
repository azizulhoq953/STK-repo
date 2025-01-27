import CartModel from '../../models/cart';
import ProductModel from '../../models/order.model';
export const CartService = {
  addItemToCart: async (userId: string, productId: string, quantity: number) => {
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error('Product not found');

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      const newCart = new CartModel({
        user: userId,
        items: [{ product: productId, quantity }],
        totalAmount: product.price * quantity,
      });
      return await newCart.save();
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * product.price, 0);
    return await cart.save();
  },

  getCart: async (userId: string) => {
    return await CartModel.findOne({ user: userId }).populate('items.product');
  },

  clearCart: async (userId: string) => {
    return await CartModel.findOneAndDelete({ user: userId });
  },
};
