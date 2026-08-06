const TeacherAttendance = require('../models/TeacherAttendance')

// @desc    Record teacher attendance
// @route   POST /api/teacher-attendance
// @access  Private (Admin)
const recordTeacherAttendance = async (req, res) => {
  try {
    const { teacherId, status, notes } = req.body
    const recordedBy = req.user.id

    if (!teacherId || !status) {
      return res.status(400).json({ message: 'Teacher ID and status are required' })
    }

    const attendance = await TeacherAttendance.record(teacherId, status, notes, recordedBy)
    res.status(201).json({
      success: true,
      message: 'Teacher attendance recorded successfully',
      attendance
    })
  } catch (error) {
    console.error('❌ Record teacher attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Record attendance for multiple teachers
// @route   POST /api/teacher-attendance/bulk
// @access  Private (Admin)
const recordBulkTeacherAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body
    const recordedBy = req.user.id

    if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({ message: 'Attendance data is required' })
    }

    const dataWithUser = attendanceData.map(record => ({
      ...record,
      recordedBy
    }))

    const results = await TeacherAttendance.recordBulk(dataWithUser)
    res.status(201).json({
      success: true,
      message: `Teacher attendance recorded for ${results.length} teachers`,
      count: results.length,
      results
    })
  } catch (error) {
    console.error('❌ Record bulk teacher attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get today's teacher attendance
// @route   GET /api/teacher-attendance/today
// @access  Private (Admin)
const getTodayTeacherAttendance = async (req, res) => {
  try {
    const attendance = await TeacherAttendance.getTodayAttendance()
    const summary = await TeacherAttendance.getTodaySummary()
    
    res.json({
      success: true,
      attendance,
      summary
    })
  } catch (error) {
    console.error('❌ Get today teacher attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get teacher attendance by date
// @route   GET /api/teacher-attendance/date/:date
// @access  Private (Admin)
const getTeacherAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params
    const attendance = await TeacherAttendance.getByDate(date)
    const summary = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      excused: attendance.filter(a => a.status === 'excused').length,
      not_recorded: attendance.filter(a => a.status === null).length
    }
    
    res.json({
      success: true,
      attendance,
      summary
    })
  } catch (error) {
    console.error('❌ Get teacher attendance by date error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get teacher attendance history
// @route   GET /api/teacher-attendance/teacher/:teacherId
// @access  Private (Admin)
const getTeacherAttendanceHistory = async (req, res) => {
  try {
    const { teacherId } = req.params
    const { startDate, endDate } = req.query
    const history = await TeacherAttendance.getByTeacher(teacherId, startDate, endDate)
    
    res.json({
      success: true,
      history
    })
  } catch (error) {
    console.error('❌ Get teacher attendance history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get teacher attendance stats
// @route   GET /api/teacher-attendance/teacher/:teacherId/stats
// @access  Private (Admin)
const getTeacherAttendanceStats = async (req, res) => {
  try {
    const { teacherId } = req.params
    const stats = await TeacherAttendance.getStats(teacherId)
    
    res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('❌ Get teacher attendance stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update teacher attendance
// @route   PUT /api/teacher-attendance/:id
// @access  Private (Admin)
const updateTeacherAttendance = async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    if (!status) {
      return res.status(400).json({ message: 'Status is required' })
    }

    const attendance = await TeacherAttendance.update(id, status, notes)
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' })
    }

    res.json({
      success: true,
      message: 'Teacher attendance updated successfully',
      attendance
    })
  } catch (error) {
    console.error('❌ Update teacher attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Delete teacher attendance
// @route   DELETE /api/teacher-attendance/:id
// @access  Private (Admin)
const deleteTeacherAttendance = async (req, res) => {
  try {
    const { id } = req.params

    const attendance = await TeacherAttendance.delete(id)
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' })
    }

    res.json({
      success: true,
      message: 'Teacher attendance record deleted successfully'
    })
  } catch (error) {
    console.error('❌ Delete teacher attendance error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get teacher attendance summary for dashboard
// @route   GET /api/teacher-attendance/summary
// @access  Private (Admin)
const getTeacherAttendanceSummary = async (req, res) => {
  try {
    const summary = await TeacherAttendance.getTodaySummary()
    
    res.json({
      success: true,
      summary
    })
  } catch (error) {
    console.error('❌ Get teacher attendance summary error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  recordTeacherAttendance,
  recordBulkTeacherAttendance,
  getTodayTeacherAttendance,
  getTeacherAttendanceByDate,
  getTeacherAttendanceHistory,
  getTeacherAttendanceStats,
  updateTeacherAttendance,
  deleteTeacherAttendance,
  getTeacherAttendanceSummary
}