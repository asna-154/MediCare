const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getProfile,
  changePassword,
  deleteAccount 
} = require('../controllers/userController');

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Logout
// In userRoutes.js
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Logout failed" });
        }
        
        // Clear the session cookie
        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            secure: false // Should be true in production with HTTPS
        });
        
        res.json({ message: "Logged out successfully" });
    });
});

// Check login status
router.get('/status', (req, res) => {
  if (req.session.user) return res.status(200).json({ loggedIn: true, user: req.session.user });
  res.status(200).json({ loggedIn: false });
});

// Get user profile
router.get('/profile', getProfile);

// Change password
router.put('/change-password', changePassword);

// Delete account
router.delete('/delete-account', deleteAccount);

module.exports = router;