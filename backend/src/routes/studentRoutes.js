const express = require('express')
const router = express.Router()
const {
  createStudent,
  getStudents,
  getStudent,
  getStudentsByTeacher,
  updateStudent,
  deleteStudent,
  searchStudents
} = require('../controllers/studentController')
const { auth, checkRole } = require('../middleware/auth')

// Protected routes (all require auth)
router.use(auth)

// Admin and Teacher routes
router.get('/', getStudents)
router.get('/search/:query', searchStudents)
router.get('/:id', getStudent)

// Teacher specific
router.get('/teacher/:teacherId', getStudentsByTeacher)

// Admin only routes
router.post('/', checkRole('admin'), createStudent)
router.put('/:id', checkRole('admin'), updateStudent)
router.delete('/:id', checkRole('admin'), deleteStudent)

module.exports = router