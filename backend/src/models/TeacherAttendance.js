const pool = require('../config/database')

class TeacherAttendance {
  // Record attendance for a teacher
  static async record(teacherId, status, notes, recordedBy) {
    try {
      const result = await pool.query(
        `INSERT INTO teacher_attendance (teacher_id, date, status, notes, recorded_by)
         VALUES ($1, CURRENT_DATE, $2, $3, $4)
         ON CONFLICT (teacher_id, date) 
         DO UPDATE SET 
           status = $2, 
           notes = $3, 
           recorded_by = $4,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [teacherId, status, notes, recordedBy]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Record teacher attendance error:', error)
      throw error
    }
  }

  // Record attendance for multiple teachers
  static async recordBulk(attendanceData) {
    try {
      const client = await pool.connect()
      const results = []
      
      for (const record of attendanceData) {
        const { teacherId, status, notes, recordedBy } = record
        const result = await client.query(
          `INSERT INTO teacher_attendance (teacher_id, date, status, notes, recorded_by)
           VALUES ($1, CURRENT_DATE, $2, $3, $4)
           ON CONFLICT (teacher_id, date) 
           DO UPDATE SET 
             status = $2, 
             notes = $3, 
             recorded_by = $4,
             updated_at = CURRENT_TIMESTAMP
           RETURNING *`,
          [teacherId, status, notes, recordedBy]
        )
        results.push(result.rows[0])
      }
      
      client.release()
      return results
    } catch (error) {
      console.error('❌ Record bulk teacher attendance error:', error)
      throw error
    }
  }

  // Get today's attendance for all teachers
  static async getTodayAttendance() {
    try {
      const result = await pool.query(
        `SELECT u.id, u.name, u.email, u.phone,
                ta.status, ta.notes, ta.recorded_by, ta.id as attendance_id,
                r.name as recorded_by_name
         FROM users u
         LEFT JOIN teacher_attendance ta ON u.id = ta.teacher_id AND ta.date = CURRENT_DATE
         LEFT JOIN users r ON ta.recorded_by = r.id
         WHERE u.role = 'teacher'
         ORDER BY u.name`,
        []
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get today teacher attendance error:', error)
      throw error
    }
  }

  // Get attendance for a specific date
  static async getByDate(date) {
    try {
      const result = await pool.query(
        `SELECT u.id, u.name, u.email, u.phone,
                ta.status, ta.notes, ta.recorded_by,
                r.name as recorded_by_name
         FROM users u
         LEFT JOIN teacher_attendance ta ON u.id = ta.teacher_id AND ta.date = $1
         LEFT JOIN users r ON ta.recorded_by = r.id
         WHERE u.role = 'teacher'
         ORDER BY u.name`,
        [date]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get teacher attendance by date error:', error)
      throw error
    }
  }

  // Get attendance for a specific teacher
  static async getByTeacher(teacherId, startDate, endDate) {
    try {
      const result = await pool.query(
        `SELECT ta.*, r.name as recorded_by_name
         FROM teacher_attendance ta
         LEFT JOIN users r ON ta.recorded_by = r.id
         WHERE ta.teacher_id = $1
           AND ta.date BETWEEN $2 AND $3
         ORDER BY ta.date DESC`,
        [teacherId, startDate || '2000-01-01', endDate || '2100-01-01']
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get teacher attendance history error:', error)
      throw error
    }
  }

  // Get teacher attendance stats
  static async getStats(teacherId) {
    try {
      const result = await pool.query(
        `SELECT 
           COUNT(*) as total_days,
           COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
           COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
           COUNT(CASE WHEN status = 'late' THEN 1 END) as late_days,
           COUNT(CASE WHEN status = 'excused' THEN 1 END) as excused_days,
           CASE 
             WHEN COUNT(*) > 0 
             THEN ROUND(COUNT(CASE WHEN status = 'present' THEN 1 END)::numeric / COUNT(*) * 100, 2) 
             ELSE 0 
           END as attendance_rate
         FROM teacher_attendance
         WHERE teacher_id = $1
           AND date >= CURRENT_DATE - INTERVAL '30 days'`,
        [teacherId]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Get teacher stats error:', error)
      throw error
    }
  }

  // Get overall teacher attendance summary for today
  static async getTodaySummary() {
    try {
      const result = await pool.query(
        `SELECT 
           COUNT(*) as total_teachers,
           COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
           COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
           COUNT(CASE WHEN status = 'late' THEN 1 END) as late,
           COUNT(CASE WHEN status = 'excused' THEN 1 END) as excused,
           COUNT(CASE WHEN status IS NULL THEN 1 END) as not_recorded
         FROM users u
         LEFT JOIN teacher_attendance ta ON u.id = ta.teacher_id AND ta.date = CURRENT_DATE
         WHERE u.role = 'teacher'`,
        []
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Get teacher attendance summary error:', error)
      throw error
    }
  }

  // Update attendance status
  static async update(id, status, notes) {
    try {
      const result = await pool.query(
        `UPDATE teacher_attendance 
         SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [status, notes, id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Update teacher attendance error:', error)
      throw error
    }
  }

  // Delete attendance record
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM teacher_attendance WHERE id = $1 RETURNING id',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Delete teacher attendance error:', error)
      throw error
    }
  }
}

module.exports = TeacherAttendance