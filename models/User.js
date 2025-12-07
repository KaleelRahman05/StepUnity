// User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  
  // Student-specific fields
  rollNumber: { type: String, sparse: true },
  department: String,
  interestedStyle: { 
    type: String, 
    enum: ['Folk', 'Classic', 'Hip-hop'] 
  },
  membershipStatus: { type: Boolean, default: false },
  assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Teacher-specific fields
  styleSpecialization: String,
  bio: String,
  achievements: [String],
  socialLinks: {
    instagram: String,
    youtube: String,
    twitter: String
  },
  
  createdAt: { type: Date, default: Date.now }
});

// No pre-save hook - hash in controller instead

// Method to compare password during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
