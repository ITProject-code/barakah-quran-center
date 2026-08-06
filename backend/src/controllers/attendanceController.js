const pool = require('../config/database')
const Attendance = require('../models/Attendance')

// @desc    Record attendance for a student
// @route   POST /api/attendance
// @access  Private (Admin/Teacher)
const recordAttendance = async (req, res) => {
  try {
    const { studentId, classId, status, notes } = req.body
    const recordedBy = req.user.id

    if (!studentId || !status) {
      return res.status(400).json({ message: 'Student ID and status are required' })
    }

    const attendance = await Attendance.record(studentId, classId, status, notes, recordedBy)
    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      attendance
    })
  } catch (error) {
    console.error('❌ Record attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Record attendance for multiple students
// @route   POST /api/attendance/bulk
// @access  Private (Admin/Teacher)
const recordBulkAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body
    const recordedBy = req.user.id

    if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({ message: 'Attendance data is required' })
    }

    // Add recordedBy to each record
    const dataWithUser = attendanceData.map(record => ({
      ...record,
      recordedBy
    }))

    const results = await Attendance.recordBulk(dataWithUser)
    res.status(201).json({
      success: true,
      message: `Attendance recorded for ${results.length} students`,
      count: results.length,
      results
    })
  } catch (error) {
    console.error('❌ Record bulk attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get attendance for a student
// @route   GET /api/attendance/student/:studentId
// @access  Private (Admin/Teacher)
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params
    const { startDate, endDate } = req.query

    const attendance = await Attendance.getByStudent(studentId, startDate, endDate)
    res.json({
      success: true,
      count: attendance.length,
      attendance
    })
  } catch (error) {
    console.error('❌ Get student attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get attendance for a class on a specific date
// @route   GET /api/attendance/class/:classId
// @access  Private (Admin/Teacher)
const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params
    const { date } = req.query

    const attendance = await Attendance.getByClass(classId, date)
    res.json({
      success: true,
      count: attendance.length,
      attendance
    })
  } catch (error) {
    console.error('❌ Get class attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get today's attendance for a class
// @route   GET /api/attendance/class/:classId/today
// @access  Private (Admin/Teacher)
const getTodayAttendance = async (req, res) => {
  try {
    const { classId } = req.params

    const attendance = await Attendance.getTodayAttendance(classId)
    res.json({
      success: true,
      count: attendance.length,
      attendance
    })
  } catch (error) {
    console.error('❌ Get today attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get attendance for a specific date
// @route   GET /api/attendance/date
// @access  Private (Admin)
const getDateAttendance = async (req, res) => {
  try {
    const { date } = req.query

    const attendance = await Attendance.getByDate(date)
    res.json({
      success: true,
      count: attendance.length,
      attendance
    })
  } catch (error) {
    console.error('❌ Get date attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get attendance stats for a student
// @route   GET /api/attendance/student/:studentId/stats
// @access  Private (Admin/Teacher)
const getStudentStats = async (req, res) => {
  try {
    const { studentId } = req.params

    const stats = await Attendance.getStudentStats(studentId)
    res.json({
      success: true,
      stats: stats || {
        total_days: 0,
        present_days: 0,
        absent_days: 0,
        late_days: 0,
        excused_days: 0,
        attendance_rate: 0
      }
    })
  } catch (error) {
    console.error('❌ Get student stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get attendance stats for a teacher's students
// @route   GET /api/attendance/teacher/:teacherId/stats
// @access  Private (Teacher)
const getTeacherAttendanceStats = async (req, res) => {
  try {
    const { teacherId } = req.params
    
    // Get all students assigned to this teacher
    const studentsResult = await pool.query(
      'SELECT id FROM students WHERE teacher_id = $1 AND status = $2',
      [teacherId, 'active']
    )
    const studentIds = studentsResult.rows.map(s => s.id)
    
    if (studentIds.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalStudents: 0,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          lateDays: 0,
          excusedDays: 0,
          attendanceRate: 0
        }
      })
    }

    // Get attendance stats for these students
    const statsResult = await pool.query(
      `SELECT 
         COUNT(*) as total_days,
         COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
         COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
         COUNT(CASE WHEN status = 'late' THEN 1 END) as late_days,
         COUNT(CASE WHEN status = 'excused' THEN 1 END) as excused_days,
         COUNT(DISTINCT student_id) as total_students
       FROM attendance
       WHERE student_id = ANY($1)
         AND date >= CURRENT_DATE - INTERVAL '30 days'`,
      [studentIds]
    )
    
    const stats = statsResult.rows[0] || {
      total_days: 0,
      present_days: 0,
      absent_days: 0,
      late_days: 0,
      excused_days: 0,
      total_students: 0
    }
    
    const totalDays = parseInt(stats.total_days) || 0
    const presentDays = parseInt(stats.present_days) || 0
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

    res.json({
      success: true,
      stats: {
        totalStudents: parseInt(stats.total_students) || 0,
        totalDays: totalDays,
        presentDays: presentDays,
        absentDays: parseInt(stats.absent_days) || 0,
        lateDays: parseInt(stats.late_days) || 0,
        excusedDays: parseInt(stats.excused_days) || 0,
        attendanceRate: attendanceRate
      }
    })
  } catch (error) {
    console.error('❌ Get teacher attendance stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update attendance status
// @route   PUT /api/attendance/:id
// @access  Private (Admin/Teacher)
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    if (!status) {
      return res.status(400).json({ message: 'Status is required' })
    }

    const attendance = await Attendance.update(id, status, notes)
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' })
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      attendance
    })
  } catch (error) {
    console.error('❌ Update attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Admin)
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params

    const attendance = await Attendance.delete(id)
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' })
    }

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    })
  } catch (error) {
    console.error('❌ Delete attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  recordAttendance,
  recordBulkAttendance,
  getStudentAttendance,
  getClassAttendance,
  getTodayAttendance,
  getDateAttendance,
  getStudentStats,
  getTeacherAttendanceStats,
  updateAttendance,
  deleteAttendance
}