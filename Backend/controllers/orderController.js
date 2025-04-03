const Order = require("../models/order");
const Cart = require("../models/cart");
const Medicine =require("../models/medicine");

// Place an order
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, contact } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    // Check stock availability
    for (let item of cart.items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (medicine.stock.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${medicine.productName}` });
      }
    }

    // Reduce stock
    for (let item of cart.items) {
      await Medicine.findByIdAndUpdate(item.medicineId, { $inc: { "stock.quantity": -item.quantity } });
    }

    const newOrder = new Order({
      userId,
      items: cart.items,
      totalAmount: cart.totalPrice,
      status: "Pending",
      paymentStatus: "Pending",
      address,
      contact
    });

    await newOrder.save();
    
    // Clear cart after placing order
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all orders for a user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.medicineId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });

    res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
