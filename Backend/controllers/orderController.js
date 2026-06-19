// controllers/orderController.js
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Generate order number function
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `MC-${timestamp}${random}`;
};

// Create new order
const createOrder = async (req, res) => {
  try {
    console.log('=== CREATE ORDER START ===');
    
    if (!req.session.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Please login to place order' 
      });
    }

    const { 
      shippingAddress, 
      paymentMethod = 'cod',
      notes = '' 
    } = req.body;

    console.log('Order data:', { shippingAddress, paymentMethod });

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address'
      });
    }

    const userId = req.session.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // Calculate totals
    const subtotal = cart.total;
    const shippingFee = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingFee + tax;

    // Generate order number
    const orderNumber = generateOrderNumber();
    console.log('Generated order number:', orderNumber);

    // Create order - MANUALLY SET orderNumber
    const order = new Order({
      userId,
      orderNumber: orderNumber, // ← MANUALLY SET IT HERE
      items: cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        icon: item.icon
      })),
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      discount: 0,
      total,
      notes
    });

    console.log('Order to save:', order);

    // Save order
    const savedOrder = await order.save();
    console.log('Order saved successfully! Order number:', savedOrder.orderNumber);

    // Clear cart after successful order
    cart.items = [];
    await cart.save();
    console.log('Cart cleared');

    console.log('=== CREATE ORDER END ===');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        total: savedOrder.total,
        status: savedOrder.orderStatus
      }
    });

  } catch (error) {
    console.error('=== CREATE ORDER ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for MongoDB errors
    if (error.name === 'MongoError' && error.code === 11000) {
      // Duplicate order number - generate new one and retry?
      console.error('Duplicate order number error');
    }
    
    console.error('=== CREATE ORDER ERROR END ===');
    
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// ... rest of your orderController.js ...
// Get user's orders
const getOrders = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to view orders'
      });
    }

    const orders = await Order.find({ userId: req.session.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        items: order.items,
        total: order.total,
        status: order.orderStatus,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get specific order
const getOrderById = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login'
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.session.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        items: order.items,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        status: order.orderStatus,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.orderStatus
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login'
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.session.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow cancellation if order is pending
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order after processing'
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get order count
const getOrderCount = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ 
        success: true,
        count: 0 
      });
    }

    const count = await Order.countDocuments({ 
      userId: req.session.user.id 
    });

    res.json({ 
      success: true,
      count 
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderCount
};