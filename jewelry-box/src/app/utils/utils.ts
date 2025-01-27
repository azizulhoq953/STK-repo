// utils.ts (or similar file)
export const calculateTotalPrice = (cartItems: { quantity: number; price: number }[], deliveryCharge: number): number => {
    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    return total + deliveryCharge; // Make sure it's a number
  };
  