import User from "../models/user.js";
import Product from "../models/product.js";

const cartController = {
  // Add item to cart
  addItemToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const user = await User.findById(req.user._id);
      const cartItem = user.cart.find(item => item.product.toString() === productId);

      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }

      await user.save();
      res.status(200).json({ message: "Item added to cart", cart: user.cart });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ message: "Error adding item to cart", error });
    }
  },

  // Remove item from cart
  removeItemFromCart: async (req, res) => {
    try {
      const { productId } = req.body;
      const user = await User.findById(req.user._id);
      user.cart = user.cart.filter(item => item.product.toString() !== productId);

      await user.save();
      res.status(200).json({ message: "Item removed from cart", cart: user.cart });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ message: "Error removing item from cart", error });
    }
  },

  // Get user's cart
  getCart: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('cart.product');
      res.status(200).json({ cart: user.cart });
    } catch (error) {
      console.error("Error retrieving cart:", error);
      res.status(500).json({ message: "Error retrieving cart", error });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.cart = [];

      await user.save();
      res.status(200).json({ message: "Cart cleared", cart: user.cart });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Error clearing cart", error });
    }
  }
};

export default cartController;
