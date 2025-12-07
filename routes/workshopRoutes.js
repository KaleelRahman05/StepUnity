const express = require('express');
const {
  getWorkshops,
  createWorkshop,
  registerForWorkshop
} = require('../controllers/workshopController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getWorkshops);
router.post('/', protect, authorize('teacher'), createWorkshop);
router.post('/:id/register', protect, registerForWorkshop);

module.exports = router;
