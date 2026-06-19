const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    try {
        // Check if user is logged in
        console.log('=== ADD TO CART START ===');
        console.log('Session user:', req.session.user);
        
        if (!req.session.user || !req.session.user.id) {
            console.log('No user session found');
            return res.status(401).json({ 
                success: false,
                message: 'Please login to add items to cart' 
            });
        }
        
        const { productId, quantity = 1 } = req.body;
        console.log('Request body:', { productId, quantity });
        console.log('User ID:', req.session.user.id);
        
        // Validate input
        if (!productId) {
            return res.status(400).json({ 
                success: false,
                message: 'Product ID is required' 
            });
        }
        
        // Find the product
        console.log('Looking for product:', productId);
        const product = await Product.findById(productId);
        console.log('Found product:', product ? product.name : 'Not found');
        
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }
        
        const userId = req.session.user.id;
        
        // Find user's cart or create new one
        console.log('Looking for cart with userId:', userId);
        let cart = await Cart.findOne({ userId });
        console.log('Existing cart found:', cart ? 'Yes' : 'No');
        
        if (!cart) {
            // Create new cart
            console.log('Creating NEW cart');
            cart = new Cart({
                userId: userId,
                items: [{
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: parseInt(quantity),
                    category: product.category,
                    icon: product.icon || 'fas fa-pills'
                }]
            });
        } else {
            // Check if product already exists in cart
            const existingItemIndex = cart.items.findIndex(item => 
                item.productId.toString() === productId
            );
            
            if (existingItemIndex > -1) {
                // Update quantity of existing item
                console.log('Product exists in cart, updating quantity');
                cart.items[existingItemIndex].quantity += parseInt(quantity);
            } else {
                // Add new item to cart
                console.log('Adding NEW item to cart');
                cart.items.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: parseInt(quantity),
                    category: product.category,
                    icon: product.icon || 'fas fa-pills'
                });
            }
        }
        
        console.log('Cart before save:', cart);
        console.log('Cart items:', cart.items);
        
        // Save to database
        const savedCart = await cart.save();
        console.log('Cart saved successfully!');
        console.log('Saved cart ID:', savedCart._id);
        console.log('Total items:', savedCart.items.length);
        console.log('=== ADD TO CART END ===');
        
        res.json({ 
            success: true,
            message: 'Product added to cart successfully',
            cart: {
                items: savedCart.items,
                total: savedCart.total,
                itemCount: savedCart.itemCount
            }
        });
        
    } catch (error) {
        console.error('=== ADD TO CART ERROR ===');
        console.error('Error:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== ADD TO CART ERROR END ===');
        
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};

/* GET USER CART */
const getCart = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.json({ 
                success: true,
                items: [], 
                total: 0,
                itemCount: 0 
            });
        }
        
        const cart = await Cart.findOne({ userId: req.session.user.id });
        
        if (!cart) {
            return res.json({ 
                success: true,
                items: [], 
                total: 0,
                itemCount: 0 
            });
        }
        
        res.json({
            success: true,
            items: cart.items,
            total: cart.total,
            itemCount: cart.itemCount
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

/* UPDATE CART ITEM QUANTITY */
const updateCartItem = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Please login' 
            });
        }
        
        const { id: productId } = req.params;
        const { action, quantity } = req.body;
        
        const cart = await Cart.findOne({ userId: req.session.user.id });
        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: "Cart not found" 
            });
        }
        
        const itemIndex = cart.items.findIndex(item => 
            item.productId.toString() === productId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ 
                success: false,
                message: "Item not found in cart" 
            });
        }
        
        if (quantity !== undefined) {
            // Set specific quantity
            const newQuantity = parseInt(quantity);
            if (newQuantity < 1) {
                // Remove item if quantity is 0 or less
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = newQuantity;
            }
        } else if (action === 'increase') {
            cart.items[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            } else {
                // Remove item if quantity becomes 0
                cart.items.splice(itemIndex, 1);
            }
        } else {
            return res.status(400).json({ 
                success: false,
                message: "Please provide action or quantity" 
            });
        }
        
        await cart.save();
        
        res.json({
            success: true,
            message: "Cart updated successfully",
            cart: {
                items: cart.items,
                total: cart.total,
                itemCount: cart.itemCount
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

/* REMOVE ITEM FROM CART */
const removeFromCart = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Please login' 
            });
        }
        
        const { id: productId } = req.params;
        
        const cart = await Cart.findOne({ userId: req.session.user.id });
        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: "Cart not found" 
            });
        }
        
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => 
            item.productId.toString() !== productId
        );
        
        if (cart.items.length === initialLength) {
            return res.status(404).json({ 
                success: false,
                message: "Item not found in cart" 
            });
        }
        
        await cart.save();
        
        res.json({
            success: true,
            message: "Item removed from cart",
            cart: {
                items: cart.items,
                total: cart.total,
                itemCount: cart.itemCount
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

/* CLEAR ENTIRE CART */
const clearCart = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Please login' 
            });
        }
        
        const cart = await Cart.findOne({ userId: req.session.user.id });
        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: "Cart not found" 
            });
        }
        
        cart.items = [];
        await cart.save();
        
        res.json({
            success: true,
            message: "Cart cleared successfully",
            cart: {
                items: cart.items,
                total: cart.total,
                itemCount: cart.itemCount
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

/* GET CART COUNT */
const getCartCount = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.json({ 
                success: true,
                count: 0 
            });
        }
        
        const cart = await Cart.findOne({ userId: req.session.user.id });
        const count = cart ? cart.itemCount : 0;
        
        res.json({ 
            success: true,
            count: count 
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Export all functions
module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount
};