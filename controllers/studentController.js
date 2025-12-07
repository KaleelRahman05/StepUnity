// studentController.js
const Assignment = require('../models/Assignment');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// Get assigned teacher and weekly tasks
exports.getDashboard = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate('assignedTeacher');
    
    if (!student.assignedTeacher) {
      return res.status(404).json({
        success: false,
        message: 'No teacher assigned yet'
      });
    }
    
    const assignments = await Assignment.find({
      teacher: student.assignedTeacher._id
    }).sort('-createdAt').limit(5);
    
    res.json({
      success: true,
      data: {
        student,
        teacher: student.assignedTeacher,
        assignments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit video assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, videoLink } = req.body;
    
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user.id
    );
    
    if (existingSubmission) {
      existingSubmission.videoLink = videoLink;
      existingSubmission.submittedAt = Date.now();
    } else {
      assignment.submissions.push({
        student: req.user.id,
        videoLink,
        submittedAt: Date.now()
      });
    }
    
    await assignment.save();
    
    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit leave request
exports.submitLeaveRequest = async (req, res) => {
  try {
    const { reason, date } = req.body;
    
    const student = await User.findById(req.user.id);
    
    if (!student.assignedTeacher) {
      return res.status(400).json({
        success: false,
        message: 'No teacher assigned to approve leave'
      });
    }
    
    const leaveRequest = await LeaveRequest.create({
      student: req.user.id,
      teacher: student.assignedTeacher,
      reason,
      date
    });
    
    res.status(201).json({
      success: true,
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my leave requests
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ student: req.user.id })
      .populate('teacher', 'name')
      .sort('-createdAt');
    
    res.json({
      success: true,
      data: leaveRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Post comment/doubt
exports.postComment = async (req, res) => {
  try {
    const { assignmentId, comment } = req.body;
    
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // You can add a comments array to Assignment schema if needed
    // For now, this is a placeholder
    
    res.json({
      success: true,
      message: 'Comment posted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
