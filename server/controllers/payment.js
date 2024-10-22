import Payment from "../models/payment.js";
import Order from "../models/order.js";

const paymentController = {
  // Process payment
  processPayment: async (req, res) => {
    try {
      const { orderId, amount, paymentMethod } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({ message: "Payment already processed or order not valid" });
      }

      const newPayment = new Payment({
        user: req.user._id,
        order: orderId,
        amount,
        paymentMethod,
        paymentStatus: 'completed'
      });

      await newPayment.save();
      order.status = 'paid';
      await order.save();

      res.status(201).json({ message: "Payment processed successfully", payment: newPayment });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Error processing payment", error });
    }
  },

  // Get payment by ID
  getPaymentById: async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id).populate('order');
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.status(200).json(payment);
    } catch (error) {
      console.error("Error retrieving payment:", error);
      res.status(500).json({ message: "Error retrieving payment", error });
    }
  },

  // Get user payment history
  getUserPayments: async (req, res) => {
    try {
      const payments = await Payment.find({ user: req.user._id }).populate('order');
      res.status(200).json(payments);
    } catch (error) {
      console.error("Error retrieving payment history:", error);
      res.status(500).json({ message: "Error retrieving payment history", error });
    }
  }
};

export default paymentController;
