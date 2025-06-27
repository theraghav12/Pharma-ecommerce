import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/admin.controller.js";
import {
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    updatePaymentStatus
  } from "../controllers/adminOrder.controller.js";
  import adminAuth from "../middleware/AdminAuth.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/orders", adminAuth,getAllOrders);
router.put("/order/:id/status", adminAuth,updateOrderStatus);
router.delete("/order/:id", adminAuth,deleteOrder);
router.put("/order/payment-status/:id",adminAuth,updatePaymentStatus);
export default router;
