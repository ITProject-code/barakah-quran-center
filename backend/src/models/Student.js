const pool = require('../config/database')

class Student {
  // Generate Student ID
  static generateStudentId() {
    const year = new Date().getFullYear()
    const random = Math.floor(1000 + Math.random() * 9000)
    return `BQC-${year}-${random}`
  }

  // Create new student
  static async create(studentData) {
    try {
      const {
        fullName,
        arabicName,
        studentId,
        guardianName,
        guardianPhone,
        enrollmentDate,
        classId,
        teacherId
      } = studentData

      const result = await pool.query(
        `INSERT INTO students (
          full_name, arabic_name, student_id, 
          guardian_name, guardian_phone, 
          enrollment_date, class_id, teacher_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          fullName, arabicName, studentId,
          guardianName, guardianPhone,
          enrollmentDate, classId, teacherId
        ]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Create student error:', error)
      throw error
    }
  }

  // Get all students
  static async findAll() {
    try {
      const result = await pool.query(
        `SELECT s.*, 
          t.name as teacher_name,
          c.name as class_name
         FROM students s
         LEFT JOIN users t ON s.teacher_id = t.id
         LEFT JOIN classes c ON s.class_id = c.id
         ORDER BY s.created_at DESC`
      )
      return result.rows
    } catch (error) {
      console.error('❌ Find all students error:', error)
      throw error
    }
  }

  // Find student by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        `SELECT s.*, 
          t.name as teacher_name,
          c.name as class_name
         FROM students s
         LEFT JOIN users t ON s.teacher_id = t.id
         LEFT JOIN classes c ON s.class_id = c.id
         WHERE s.id = $1`,
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Find student by ID error:', error)
      throw error
    }
  }

  // Find student by Student ID
  static async findByStudentId(studentId) {
    try {
      const result = await pool.query(
        'SELECT * FROM students WHERE student_id = $1',
        [studentId]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Find student by student ID error:', error)
      throw error
    }
  }

  // Update student
  static async update(id, studentData) {
    try {
      const {
        fullName,
        arabicName,
        guardianName,
        guardianPhone,
        classId,
        teacherId,
        status
      } = studentData

      const result = await pool.query(
        `UPDATE students SET
          full_name = $1, arabic_name = $2,
          guardian_name = $3, guardian_phone = $4,
          class_id = $5, teacher_id = $6, status = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *`,
        [
          fullName, arabicName,
          guardianName, guardianPhone,
          classId, teacherId, status, id
        ]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Update student error:', error)
      throw error
    }
  }

  // Delete student
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM students WHERE id = $1 RETURNING id',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Delete student error:', error)
      throw error
    }
  }

  // Get students by teacher
  static async findByTeacher(teacherId) {
    try {
      const result = await pool.query(
        `SELECT s.* 
         FROM students s
         WHERE s.teacher_id = $1
         ORDER BY s.full_name`,
        [teacherId]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Find students by teacher error:', error)
      throw error
    }
  }

  // Get students by class
  static async findByClass(classId) {
    try {
      const result = await pool.query(
        `SELECT s.*, 
          t.name as teacher_name
         FROM students s
         LEFT JOIN users t ON s.teacher_id = t.id
         WHERE s.class_id = $1
         ORDER BY s.full_name`,
        [classId]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Find students by class error:', error)
      throw error
    }
  }

  // Search students
  static async search(query) {
    try {
      const result = await pool.query(
        `SELECT s.*, 
          t.name as teacher_name,
          c.name as class_name
         FROM students s
         LEFT JOIN users t ON s.teacher_id = t.id
         LEFT JOIN classes c ON s.class_id = c.id
         WHERE s.full_name ILIKE $1 
         OR s.student_id ILIKE $1
         OR s.guardian_name ILIKE $1
         ORDER BY s.full_name`,
        [`%${query}%`]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Search students error:', error)
      throw error
    }
  }

  // Get student count
  static async count() {
    try {
      const result = await pool.query('SELECT COUNT(*) FROM students')
      return parseInt(result.rows[0].count)
    } catch (error) {
      console.error('❌ Count students error:', error)
      throw error
    }
  }

  // Get active student count
  static async countActive() {
    try {
      const result = await pool.query(
        "SELECT COUNT(*) FROM students WHERE status = 'active'"
      )
      return parseInt(result.rows[0].count)
    } catch (error) {
      console.error('❌ Count active students error:', error)
      throw error
    }
  }

  // Get students by status
  static async findByStatus(status) {
    try {
      const result = await pool.query(
        `SELECT s.*, 
          t.name as teacher_name,
          c.name as class_name
         FROM students s
         LEFT JOIN users t ON s.teacher_id = t.id
         LEFT JOIN classes c ON s.class_id = c.id
         WHERE s.status = $1
         ORDER BY s.full_name`,
        [status]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Find students by status error:', error)
      throw error
    }
  }
}

module.exports = Student