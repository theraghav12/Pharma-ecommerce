import Order from '../models/order.js';

const orderController = {
  // Create a new order
  createOrder: async (req, res) => {
    try {
      const { products, prescription, totalPrice } = req.body;
      const newOrder = new Order({ user: req.user._id, products, prescription, totalPrice, status: 'pending' });
      await newOrder.save();
      res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: "Error creating order", error });
    }
  },

  // Get user orders
  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id }).populate('products.product prescription');
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders", error });
    }
  },

  // Get order by ID
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order', error });
    }
  },

  // Update order status
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(400).json({ message: "Error updating order", error });
    }
  },

  // Get all orders for admin
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate('user products.product');
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Error fetching all orders", error });
    }
  }
};

export default orderController;
