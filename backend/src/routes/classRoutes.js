const express = require('express')
const router = express.Router()
const {
  createClass,
  getClasses,
  getClass,
  getClassStudents,
  updateClass,
  deleteClass,
  getClassesByTeacher
} = require('../controllers/classController')
const { auth, checkRole } = require('../middleware/auth')

// All routes require authentication
router.use(auth)

// Get all classes
router.get('/', getClasses)

// Get class by ID
router.get('/:id', getClass)

// Get students in class
router.get('/:id/students', getClassStudents)

// Get classes by teacher
router.get('/teacher/:teacherId', getClassesByTeacher)

// Admin only routes
router.post('/', checkRole('admin'), createClass)
router.put('/:id', checkRole('admin'), updateClass)
router.delete('/:id', checkRole('admin'), deleteClass)

module.exports = router