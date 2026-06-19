const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");
const path = require("path");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SESSION MIDDLEWARE (SIMPLIFIED)
app.use(session({
    name: 'medicare.sid',  // Give it a name
    secret: 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: false,  // Allow JavaScript access
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}));

// Add debug middleware
// In server.js, replace the debug middleware with this:
app.use((req, res, next) => {
    console.log(`=== REQUEST ${req.method} ${req.path} ===`);
    console.log(`Session ID: ${req.sessionID}`);
    console.log(`Session user:`, req.session.user || 'No user');
    console.log(`Cookie header:`, req.headers.cookie || 'No cookies');
    console.log('---');
    next();
});

// Your routes...
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Static files
app.use(express.static(path.join(__dirname, '../Frontend')));

// Start server
app.listen(3000, '127.0.0.1', () => {
  console.log("✅ Server running on http://127.0.0.1:3000/");
});