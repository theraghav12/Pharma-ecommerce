const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);
router.get("/", cartController.getCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;
