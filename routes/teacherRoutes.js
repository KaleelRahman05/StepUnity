const express = require('express');
const {
  getStudents,
  createAssignment,
  getMyAssignments,
  reviewSubmission,
  getLeaveRequests,
  updateLeaveRequest
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication and teacher role
router.use(protect);
router.use(authorize('teacher'));

router.get('/students', getStudents);
router.post('/assign-students', require('../controllers/teacherController').bulkAssignStudents);
router.post('/assignments', createAssignment);
router.get('/assignments', getMyAssignments);
router.post('/assignments/review', reviewSubmission);
router.get('/leave-requests', getLeaveRequests);
router.put('/leave-requests', updateLeaveRequest);

module.exports = router;
