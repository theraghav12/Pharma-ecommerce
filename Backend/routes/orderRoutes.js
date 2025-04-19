import express from "express";
import {
  placeOrder,
  getOrders,
  getOrdersByPatientId,
  cancelOrder,
  placeOrderByUserId,
  placeOrderUsingCartId
} from "../controllers/orderController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// Place a new order
router.post("/place", auth, placeOrder);

// Get orders for logged-in user
router.get("/", auth, getOrders);

// ✅ Get orders by patient ID (admin or special access)
router.get("/patient/:id", getOrdersByPatientId);

// Cancel order
router.post("/place-guest", placeOrderByUserId);

router.put("/cancel/:id", auth, cancelOrder);

router.post("/place-from-cart", placeOrderUsingCartId);

export default router;
