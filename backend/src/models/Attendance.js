const pool = require('../config/database')

class Attendance {
  // Record attendance for a student
  static async record(studentId, classId, status, notes, recordedBy) {
    try {
      const result = await pool.query(
        `INSERT INTO attendance (student_id, class_id, date, status, notes, recorded_by)
         VALUES ($1, $2, CURRENT_DATE, $3, $4, $5)
         ON CONFLICT (student_id, date) 
         DO UPDATE SET 
           status = $3, 
           notes = $4, 
           recorded_by = $5,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [studentId, classId, status, notes, recordedBy]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Record attendance error:', error)
      throw error
    }
  }

  // Record attendance for multiple students
  static async recordBulk(attendanceData) {
    try {
      const client = await pool.connect()
      const results = []
      
      for (const record of attendanceData) {
        const { studentId, classId, status, notes, recordedBy } = record
        const result = await client.query(
          `INSERT INTO attendance (student_id, class_id, date, status, notes, recorded_by)
           VALUES ($1, $2, CURRENT_DATE, $3, $4, $5)
           ON CONFLICT (student_id, date) 
           DO UPDATE SET 
             status = $3, 
             notes = $4, 
             recorded_by = $5,
             updated_at = CURRENT_TIMESTAMP
           RETURNING *`,
          [studentId, classId, status, notes, recordedBy]
        )
        results.push(result.rows[0])
      }
      
      client.release()
      return results
    } catch (error) {
      console.error('❌ Record bulk attendance error:', error)
      throw error
    }
  }

  // Get attendance for a student
  static async getByStudent(studentId, startDate, endDate) {
    try {
      const result = await pool.query(
        `SELECT a.*, c.name as class_name, u.name as recorded_by_name
         FROM attendance a
         LEFT JOIN classes c ON a.class_id = c.id
         LEFT JOIN users u ON a.recorded_by = u.id
         WHERE a.student_id = $1
           AND a.date BETWEEN $2 AND $3
         ORDER BY a.date DESC`,
        [studentId, startDate || '2000-01-01', endDate || '2100-01-01']
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get student attendance error:', error)
      throw error
    }
  }

  // Get attendance for a class on a specific date
  static async getByClass(classId, date) {
    try {
      const result = await pool.query(
        `SELECT a.*, s.full_name as student_name, s.student_id as student_id_num
         FROM attendance a
         JOIN students s ON a.student_id = s.id
         WHERE a.class_id = $1 AND a.date = $2
         ORDER BY s.full_name`,
        [classId, date || new Date().toISOString().split('T')[0]]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get class attendance error:', error)
      throw error
    }
  }

  // Get all attendance for a specific date
  static async getByDate(date) {
    try {
      const result = await pool.query(
        `SELECT a.*, s.full_name as student_name, s.student_id as student_id_num, 
                c.name as class_name
         FROM attendance a
         JOIN students s ON a.student_id = s.id
         LEFT JOIN classes c ON a.class_id = c.id
         WHERE a.date = $1
         ORDER BY c.name, s.full_name`,
        [date || new Date().toISOString().split('T')[0]]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get date attendance error:', error)
      throw error
    }
  }

  // Get attendance summary for a class (last 30 days)
  static async getClassSummary(classId) {
    try {
      const result = await pool.query(
        `SELECT 
           COUNT(DISTINCT student_id) as total_students,
           COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
           COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
           COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
           COUNT(CASE WHEN status = 'excused' THEN 1 END) as excused_count,
           COUNT(*) as total_records,
           date
         FROM attendance
         WHERE class_id = $1 
           AND date >= CURRENT_DATE - INTERVAL '30 days'
         GROUP BY date
         ORDER BY date DESC`,
        [classId]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get class summary error:', error)
      throw error
    }
  }

  // Get attendance stats for a student (last 30 days)
  static async getStudentStats(studentId) {
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
         FROM attendance
         WHERE student_id = $1
           AND date >= CURRENT_DATE - INTERVAL '30 days'`,
        [studentId]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Get student stats error:', error)
      throw error
    }
  }

  // Get today's attendance for a class
  static async getTodayAttendance(classId) {
    try {
      const result = await pool.query(
        `SELECT s.id, s.full_name, s.student_id, 
                a.status, a.notes, a.recorded_by, a.id as attendance_id
         FROM students s
         LEFT JOIN attendance a ON s.id = a.student_id AND a.date = CURRENT_DATE
         WHERE s.class_id = $1 AND s.status = 'active'
         ORDER BY s.full_name`,
        [classId]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get today attendance error:', error)
      throw error
    }
  }

  // Update attendance status
  static async update(id, status, notes) {
    try {
      const result = await pool.query(
        `UPDATE attendance 
         SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [status, notes, id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Update attendance error:', error)
      throw error
    }
  }

  // Delete attendance record
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM attendance WHERE id = $1 RETURNING id',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Delete attendance error:', error)
      throw error
    }
  }

  // Get attendance stats for a teacher's students (last 30 days)
  static async getTeacherStats(teacherId) {
    try {
      // First get all students for this teacher
      const studentsResult = await pool.query(
        'SELECT id FROM students WHERE teacher_id = $1 AND status = $2',
        [teacherId, 'active']
      )
      
      const studentIds = studentsResult.rows.map(row => row.id)
      
      if (studentIds.length === 0) {
        return {
          total_students: 0,
          total_days: 0,
          present_days: 0,
          absent_days: 0,
          late_days: 0,
          excused_days: 0,
          attendance_rate: 0
        }
      }

      const result = await pool.query(
        `SELECT 
           COUNT(DISTINCT student_id) as total_students,
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
         FROM attendance
         WHERE student_id = ANY($1)
           AND date >= CURRENT_DATE - INTERVAL '30 days'`,
        [studentIds]
      )
      
      return result.rows[0] || {
        total_students: 0,
        total_days: 0,
        present_days: 0,
        absent_days: 0,
        late_days: 0,
        excused_days: 0,
        attendance_rate: 0
      }
    } catch (error) {
      console.error('❌ Get teacher stats error:', error)
      throw error
    }
  }
}

module.exports = Attendance