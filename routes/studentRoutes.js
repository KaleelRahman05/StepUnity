const express = require('express');
const {
  getDashboard,
  submitAssignment,
  submitLeaveRequest,
  getMyLeaveRequests,
  postComment
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.post('/assignments/submit', submitAssignment);
router.post('/leave', submitLeaveRequest);
router.get('/leave', getMyLeaveRequests);
router.post('/comments', postComment);

module.exports = router;
