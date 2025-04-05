// const express = require("express");
// const router = express.Router();
// const orderController = require("../controllers/orderController");

// router.post("/place", orderController.placeOrder);
// router.get("/", orderController.getUserOrders);
// router.put("/cancel/:id", orderController.cancelOrder);

// module.exports = router;

import express from "express";
import * as orderController from "../controllers/orderController.js";
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/place",auth ,orderController.placeOrder);
router.get("/",auth ,orderController.getOrders);
router.put("/cancel/:id",auth ,orderController.cancelOrder);

export default router;
