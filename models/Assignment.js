// models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  videoPrompt: String,
  dueDate: Date,
  styleCategory: { type: String, enum: ['Folk', 'Classic', 'Hip-hop'] },
  
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    videoLink: String,
    submittedAt: Date,
    feedback: String,
    grade: { type: String, enum: ['Excellent', 'Good', 'Needs Improvement'] },
    teacherComment: String
  }],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
