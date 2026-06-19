const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1, 
    min: 1
  },
  category: { 
    type: String 
  },
  icon: { 
    type: String, 
    default: 'fas fa-pills' 
  }
});

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, { 
  timestamps: true // Built-in createdAt, updatedAt
});

// Virtual for total price
cartSchema.virtual('total').get(function() {
  if (!this.items || this.items.length === 0) return 0;
  return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// Virtual for item count
cartSchema.virtual('itemCount').get(function() {
  if (!this.items || this.items.length === 0) return 0;
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;