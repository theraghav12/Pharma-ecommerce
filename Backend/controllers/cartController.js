import Cart from "../models/cart.js";
import Medicine from "../models/medicine.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;
    const userId = req.user.id;
    
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find((item) => item.medicineId.toString() === medicineId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ medicineId, quantity, price: medicine.pricing.sellingPrice });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    await cart.save();
    res.status(200).json({ message: "Medicine added to cart", cart });
  } catch (error) {
    console.log("Error: ",error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { medicineId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.medicineId.toString() !== medicineId);

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    await cart.save();
    res.status(200).json({ message: "Medicine removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.medicineId");
    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Optional: clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
