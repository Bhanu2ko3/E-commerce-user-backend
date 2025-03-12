const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true // Removes unnecessary spaces 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true // Converts email to lowercase 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Automatically sets the creation date
  }
});

// Export the User model
module.exports = mongoose.model('User', UserSchema);
