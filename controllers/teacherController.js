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
    // Populate student info for client convenience
    const populated = await LeaveRequest.findById(leaveRequest._id).populate('student', 'name rollNumber');

    res.json({
      success: true,
      message: `Leave request ${status}`,
      data: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk assign students who match the teacher's specialization
exports.bulkAssignStudents = async (req, res) => {
  try {
    console.log('➡️ bulkAssignStudents called by user:', req.user && req.user.id);
    const teacherId = req.user.id;

    // Fetch teacher to read their specialization
    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    if (!teacher.styleSpecialization) return res.status(400).json({ success: false, message: 'Teacher has no specialization set' });

    const style = String(teacher.styleSpecialization).trim();
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find students with matching interestedStyle (case-insensitive) and not already assigned
    const students = await User.find({
      role: 'student',
      $or: [ { assignedTeacher: { $exists: false } }, { assignedTeacher: null } ],
      interestedStyle: { $regex: `^${escapeRegex(style)}$`, $options: 'i' }
    });

    if (!students || students.length === 0) {
      // If there are no matching students, but there is exactly one unassigned student in the system,
      // try to assign that single student to a teacher who specializes in the student's interestedStyle.
      const unassignedCount = await User.countDocuments({ role: 'student', $or: [ { assignedTeacher: { $exists: false } }, { assignedTeacher: null } ] });
      if (unassignedCount === 1) {
        const single = await User.findOne({ role: 'student', $or: [ { assignedTeacher: { $exists: false } }, { assignedTeacher: null } ] });
        if (single) {
          const studentStyle = single.interestedStyle ? String(single.interestedStyle).trim() : '';
          if (studentStyle) {
            const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
            const matchingTeachers = await User.find({ role: 'teacher', styleSpecialization: { $regex: `^${escapeRegex(studentStyle)}$`, $options: 'i' } });

            if (matchingTeachers && matchingTeachers.length > 0) {
              // choose teacher with fewest assigned students
              const counts = await Promise.all(matchingTeachers.map(async (t) => {
                const cnt = await User.countDocuments({ assignedTeacher: t._id });
                return { teacher: t, count: cnt };
              }));
              counts.sort((a, b) => a.count - b.count);
              const chosen = counts[0].teacher;
              single.assignedTeacher = chosen._id;
              await single.save();
              return res.json({ success: true, message: `Assigned single student to specialized teacher ${chosen.name || chosen.email}`, assignedCount: 1, data: [{ id: single._id, name: single.name, email: single.email, assignedTo: { id: chosen._id, name: chosen.name, email: chosen.email } }] });
            }
          }

          // No specialized teacher found — fallback to assigning to requesting teacher
          single.assignedTeacher = teacherId;
          await single.save();
          return res.json({ success: true, message: 'Assigned the single unassigned student to you (no specialized teacher found)', assignedCount: 1, data: [{ id: single._id, name: single.name, email: single.email }] });
        }
      }

      return res.json({ success: true, message: 'No matching unassigned students found', assignedCount: 0, data: [] });
    }

    // Assign each student to this teacher
    const bulkOps = students.map(s => ({ updateOne: { filter: { _id: s._id }, update: { $set: { assignedTeacher: teacherId } } } }));
    await User.bulkWrite(bulkOps);

    return res.json({ success: true, message: `Assigned ${students.length} student(s) to you`, assignedCount: students.length, data: students.map(s => ({ id: s._id, name: s.name, email: s.email })) });
  } catch (error) {
    console.error('Error in bulkAssignStudents:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
