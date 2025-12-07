// worksopController.js
const Workshop = require('../models/Workshop');

// Get all workshops
exports.getWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find()
      .populate('teacher', 'name styleSpecialization')
      .sort('date');
    
    res.json({
      success: true,
      data: workshops
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create workshop (Teacher only)
exports.createWorkshop = async (req, res) => {
  try {
    const { title, date, time, style, maxCapacity } = req.body;
    
    const workshop = await Workshop.create({
      title,
      teacher: req.user.id,
      date,
      time,
      location: 'Dance Floor',
      style,
      maxCapacity
    });
    
    res.status(201).json({
      success: true,
      data: workshop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register for workshop
exports.registerForWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }
    
    // Check if already registered
    if (workshop.attendees.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this workshop'
      });
    }
    
    // Check capacity
    if (workshop.maxCapacity && workshop.attendees.length >= workshop.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Workshop is full'
      });
    }
    
    workshop.attendees.push(req.user.id);
    await workshop.save();
    
    res.json({
      success: true,
      message: 'Successfully registered for workshop',
      data: workshop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
