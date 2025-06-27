
import Order from "../models/order.js";


// Get all orders (admin)
export const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find({})
        .populate("userId", "name email")
        .populate("items.medicineId", "productName pricing");
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === "Delivered" && { deliveredAt: Date.now() })
      },
      { new: true }
    ).populate("userId", "name email")
     .populate("items.medicineId", "productName pricing.sellingPrice");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete order (admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updatePaymentStatus = async (req, res) => {
    try {
      const { paymentStatus } = req.body;
      const validPaymentStatuses = ["Pending", "Completed", "Failed", "Refunded"];
      
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status" });
      }
  
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { paymentStatus },
        { new: true }
      )
        .populate("userId", "name email")
        .populate("items.medicineId", "productName pricing.sellingPrice");
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json({ message: "Payment status updated", order });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };