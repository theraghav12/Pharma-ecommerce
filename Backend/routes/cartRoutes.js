// const express = require("express");
// const router = express.Router();
// const cartController = require("../controllers/cartController");

// router.post("/add", cartController.addToCart);
// router.post("/remove", cartController.removeFromCart);
// router.get("/", cartController.getCart);
// router.delete("/clear", cartController.clearCart);

// module.exports = router;

import express from "express";
import * as cartController from "../controllers/cartController.js";
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/add",auth, cartController.addToCart);
router.post("/remove",auth, cartController.removeFromCart);
router.get("/",auth, cartController.getCart);
router.delete("/clear",auth, cartController.clearCart);

export default router;
