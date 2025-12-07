// teacherController.js
const Assignment = require('../models/Assignment');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// Get all assigned students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      assignedTeacher: req.user.id
    }).select('-password');
    
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Post new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, videoPrompt, dueDate, styleCategory } = req.body;
    
    const assignment = await Assignment.create({
      teacher: req.user.id,
      title,
      description,
      videoPrompt,
      dueDate,
      styleCategory
    });
    
    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all assignments created by teacher
exports.getMyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.user.id })
      .populate('submissions.student', 'name rollNumber')
      .sort('-createdAt');
    
    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Review student submission and provide feedback
exports.reviewSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId, feedback, grade, teacherComment } = req.body;
    
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    if (assignment.teacher.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this assignment'
      });
    }
    
    const submission = assignment.submissions.find(
      sub => sub.student.toString() === studentId
    );
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    submission.feedback = feedback;
    submission.grade = grade;
    submission.teacherComment = teacherComment;
    
    await assignment.save();
    
    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending leave requests
exports.getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ teacher: req.user.id })
      .populate('student', 'name rollNumber department')
      .sort('-createdAt');
    
    res.json({
      success: true,
      data: leaveRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve or reject leave request
exports.updateLeaveRequest = async (req, res) => {
  try {
    const { leaveRequestId, status, teacherResponse } = req.body;
    
    const leaveRequest = await LeaveRequest.findById(leaveRequestId);
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }
    
    if (leaveRequest.teacher.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this leave request'
      });
    }
    
    leaveRequest.status = status;
    leaveRequest.teacherResponse = teacherResponse;
    await leaveRequest.save();
    
    res.json({
      success: true,
      message: `Leave request ${status}`,
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
