const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* REGISTER USER */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Set session after registration
    req.session.user = { 
      id: user._id, 
      name: user.name, 
      email: user.email 
    };

    res.status(201).json({ 
      message: "User registered successfully",
      user: req.session.user 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    // Save user to session
    req.session.user = { 
      id: user._id, 
      name: user.name, 
      email: user.email 
    };
    
    console.log('Session set:', req.session.user);
    console.log('Session ID:', req.sessionID);

    res.status(200).json({ 
      message: "Login successful", 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

/* GET USER PROFILE */
exports.getProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await User.findById(req.session.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CHANGE PASSWORD */
exports.changePassword = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.session.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE ACCOUNT */
exports.deleteAccount = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await User.findById(req.session.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    await User.findByIdAndDelete(req.session.user.id);
    
    // Destroy session
    req.session.destroy();
    
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};