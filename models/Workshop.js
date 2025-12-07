
// Workshop.js
const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  time: String,
  location: { type: String, default: 'Dance Floor' },
  style: { type: String, enum: ['Folk', 'Classic', 'Hip-hop'] },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxCapacity: Number
});

module.exports = mongoose.model('Workshop', workshopSchema);
