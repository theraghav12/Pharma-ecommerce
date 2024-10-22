import mongoose from "mongoose";
const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  });
  
const Cart = mongoose.model("Cart", CartSchema);
export default Cart;