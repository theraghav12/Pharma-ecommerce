const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/place", orderController.placeOrder);
router.get("/", orderController.getUserOrders);
router.put("/cancel/:id", orderController.cancelOrder);

module.exports = router;
