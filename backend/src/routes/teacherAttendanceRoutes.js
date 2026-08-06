const express = require('express')
const router = express.Router()
const {
  recordTeacherAttendance,
  recordBulkTeacherAttendance,
  getTodayTeacherAttendance,
  getTeacherAttendanceByDate,
  getTeacherAttendanceHistory,
  getTeacherAttendanceStats,
  updateTeacherAttendance,
  deleteTeacherAttendance,
  getTeacherAttendanceSummary
} = require('../controllers/teacherAttendanceController')
const { auth, checkRole } = require('../middleware/auth')

// All routes require authentication and admin role
router.use(auth, checkRole('admin'))

// Get today's teacher attendance
router.get('/today', getTodayTeacherAttendance)

// Get teacher attendance summary for dashboard
router.get('/summary', getTeacherAttendanceSummary)

// Get teacher attendance by date
router.get('/date/:date', getTeacherAttendanceByDate)

// Get teacher attendance history
router.get('/teacher/:teacherId', getTeacherAttendanceHistory)

// Get teacher attendance stats
router.get('/teacher/:teacherId/stats', getTeacherAttendanceStats)

// Record teacher attendance
router.post('/', recordTeacherAttendance)

// Record bulk teacher attendance
router.post('/bulk', recordBulkTeacherAttendance)

// Update teacher attendance
router.put('/:id', updateTeacherAttendance)

// Delete teacher attendance
router.delete('/:id', deleteTeacherAttendance)

module.exports = router