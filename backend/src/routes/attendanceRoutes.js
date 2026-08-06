const express = require('express')
const router = express.Router()
const {
  recordAttendance,
  recordBulkAttendance,
  getStudentAttendance,
  getClassAttendance,
  getTodayAttendance,
  getDateAttendance,
  getStudentStats,
  getTeacherAttendanceStats,  // ADD THIS
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController')
const { auth, checkRole } = require('../middleware/auth')

// All routes require authentication
router.use(auth)

// Get attendance for a specific date
router.get('/date', checkRole('admin'), getDateAttendance)

// Get attendance for a student
router.get('/student/:studentId', getStudentAttendance)

// Get attendance stats for a student
router.get('/student/:studentId/stats', getStudentStats)

// Get attendance stats for a teacher's students
router.get('/teacher/:teacherId/stats', getTeacherAttendanceStats)  // ADD THIS

// Get attendance for a class
router.get('/class/:classId', getClassAttendance)

// Get today's attendance for a class
router.get('/class/:classId/today', getTodayAttendance)

// Record attendance for a student
router.post('/', recordAttendance)

// Record attendance for multiple students
router.post('/bulk', recordBulkAttendance)

// Update attendance
router.put('/:id', updateAttendance)

// Delete attendance (Admin only)
router.delete('/:id', checkRole('admin'), deleteAttendance)

module.exports = router