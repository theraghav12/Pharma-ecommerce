import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Medicine from "../models/medicine.js";


export const placeOrder = async (req, res) => {
  try {
    console.log("Incoming order data:", req.body);

    const userId = req.user ? req.user.id : null;
    if (!userId) {
      return res.status(400).json({ message: "User must be logged in to place an order." });
    }

    const { address, contact, cartItems } = req.body;

    // Fetch or construct cart
    let cart = await Cart.findOne({ userId });
    if ((!cart || cart.items.length === 0) && cartItems && cartItems.length > 0) {
      cart = {
        items: cartItems,
        totalPrice: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Stock check and get medicine details
    const itemsWithDetails = await Promise.all(cart.items.map(async (item) => {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine || medicine.stock.quantity < item.quantity) {
        throw new Error(`Not enough stock for ${medicine?.productName || "Unknown"}`);
      }
      return {
        medicineId: medicine._id,
        medicineDetails: { // Include full medicine details
          _id: medicine._id,
          productName: medicine.productName,
          price: medicine.pricing.sellingPrice,
          // Add other fields you want to display
        },
        quantity: item.quantity,
        price: medicine.pricing.sellingPrice
      };
    }));

    // Deduct stock
    await Promise.all(itemsWithDetails.map(item => 
      Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { "stock.quantity": -item.quantity }
      })
    ));

    // Format address as a single string
    const formatAddress = (addr) => {
      if (typeof addr === 'string') return addr; // If it's already a string
      return [
        addr.street || '',
        addr.city || '',
        addr.state || '',
        addr.postalCode || '',
        addr.country || 'India'
      ].filter(Boolean).join(', ');
    };

    // Create order with enriched items
    const newOrder = new Order({
      userId,
      items: itemsWithDetails,
      totalAmount: cart.totalPrice + 50, // fixed delivery fee
      status: "Processing",
      paymentStatus: "Pending",
      address: formatAddress(address),
      contact,
      customerEmail: req.user.email,
      customerName: req.user.name
    });

    await newOrder.save();

    // Clear cart if user is logged in
    await Cart.findOneAndDelete({ userId });

    // Populate the response with medicine details
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('items.medicineId', 'productName pricing.sellingPrice');

    res.status(201).json({ 
      message: "Order placed successfully", 
      order: populatedOrder 
    });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Get all orders for a user
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.medicineId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Optional: Only allow cancellation if it's still pending or processing
    if (order.status === "Shipped" || order.status === "Delivered") {
      return res.status(400).json({ message: "Cannot cancel a shipped or delivered order" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const getOrdersByPatientId = async (req, res) => {
  try {
    const { id } = req.params; // patient ID
    const orders = await Order.find({ userId: id }).populate("items.medicineId");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this patient" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const placeOrderByUserId = async (req, res) => {
  try {
    const { userId, address, contact, cartItems } = req.body;

    if (!userId || !address || !contact || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Missing required fields or cart is empty" });
    }

    // Format address as a single string
    const formatAddress = (addr) => {
      if (typeof addr === 'string') return addr; // If it's already a string
      return [
        addr.street || '',
        addr.city || '',
        addr.state || '',
        addr.postalCode || '',
        addr.country || 'India'
      ].filter(Boolean).join(', ');
    };

    let totalAmount = 0;
    const finalItems = [];

    for (const item of cartItems) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine || medicine.stock.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${medicine?.productName || "Unknown medicine"}`
        });
      }

      const itemTotal = medicine.price * item.quantity;
      totalAmount += itemTotal;

      finalItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: medicine.price, // snapshot at purchase
      });

      // Reduce stock
      await Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { "stock.quantity": -item.quantity }
      });
    }

    const newOrder = new Order({
      userId,
      items: finalItems,
      totalAmount,
      status: "Pending",
      paymentStatus: "Pending",
      address: formatAddress(address),
      contact
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Guest order error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const placeOrderUsingCartId = async (req, res) => {
  try {
    const { cartId, address, contact } = req.body;

    if (!cartId || !address || !contact) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Format address as a single string
    const formatAddress = (addr) => {
      if (typeof addr === 'string') return addr; // If it's already a string
      return [
        addr.street || '',
        addr.city || '',
        addr.state || '',
        addr.postalCode || '',
        addr.country || 'India'
      ].filter(Boolean).join(', ');
    };

    const cart = await Cart.findById(cartId);
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart not found or empty" });
    }

    const userId = cart.userId;
    let totalAmount = 0;
    const finalItems = [];

    for (const item of cart.items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine || medicine.stock.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${medicine?.productName || "Unknown medicine"}`
        });
      }

      const itemTotal = medicine.price * item.quantity;
      totalAmount += itemTotal;

      finalItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: medicine.price
      });

      // Reduce stock
      await Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { "stock.quantity": -item.quantity }
      });
    }

    const newOrder = new Order({
      userId,
      items: finalItems,
      totalAmount,
      status: "Pending",
      paymentStatus: "Pending",
      address: formatAddress(address),
      contact
    });

    await newOrder.save();

    // Optionally delete the cart after placing the order
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order error from cart ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
