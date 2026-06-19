const express = require("express");
const router = express.Router();
const { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeFromCart,
    clearCart,
    getCartCount 
} = require("../controllers/cartController");

// Add product to cart
router.post("/", addToCart);

// Get user's cart
router.get("/", getCart);

// Update cart item quantity
router.put("/:id", updateCartItem);

// Remove item from cart
router.delete("/:id", removeFromCart);

// Clear entire cart
router.delete("/", clearCart);

// Get cart item count
router.get("/count", getCartCount);

module.exports = router;