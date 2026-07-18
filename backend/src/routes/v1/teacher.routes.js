// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/teacherrating.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

router.get('/', teacherController.getTeachers);

router.post('/:id/rate', 
  authenticate, 
  authorize('student'), 
  teacherController.rateTeacher
);

module.exports = router;