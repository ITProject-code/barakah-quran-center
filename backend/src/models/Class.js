const pool = require('../config/database')

class Class {
  // Create new class
  static async create(classData) {
    try {
      const {
        name,
        description,
        level,
        teacher_id,
        max_students
      } = classData

      // Fix: Convert empty string to null for integer fields
      const teacherId = teacher_id && teacher_id !== '' ? parseInt(teacher_id) : null
      const maxStudents = max_students && max_students !== '' ? parseInt(max_students) : 100

      const result = await pool.query(
        `INSERT INTO classes (
          name, description, level, teacher_id, max_students
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [name, description, level, teacherId, maxStudents]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Create class error:', error)
      throw error
    }
  }

  // Get all classes with student counts
  static async findAll() {
    try {
      const result = await pool.query(
        `SELECT c.*, 
          u.name as teacher_name,
          COUNT(s.id) as student_count
         FROM classes c
         LEFT JOIN users u ON c.teacher_id = u.id
         LEFT JOIN students s ON c.id = s.class_id AND s.status = 'active'
         GROUP BY c.id, u.name
         ORDER BY c.name`
      )
      return result.rows
    } catch (error) {
      console.error('❌ Find all classes error:', error)
      throw error
    }
  }

  // Find class by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        `SELECT c.*, 
          u.name as teacher_name,
          COUNT(s.id) as student_count
         FROM classes c
         LEFT JOIN users u ON c.teacher_id = u.id
         LEFT JOIN students s ON c.id = s.class_id AND s.status = 'active'
         WHERE c.id = $1
         GROUP BY c.id, u.name`,
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Find class by ID error:', error)
      throw error
    }
  }

  // Update class - FIXED
  static async update(id, classData) {
    try {
      const {
        name,
        description,
        level,
        teacher_id,
        max_students,
        status
      } = classData

      // Fix: Convert empty string to null for integer fields
      const teacherId = teacher_id && teacher_id !== '' ? parseInt(teacher_id) : null
      const maxStudents = max_students && max_students !== '' ? parseInt(max_students) : 100

      const result = await pool.query(
        `UPDATE classes SET
          name = $1, description = $2, level = $3,
          teacher_id = $4, max_students = $5, status = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *`,
        [name, description, level, teacherId, maxStudents, status, id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Update class error:', error)
      throw error
    }
  }

  // Delete class
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM classes WHERE id = $1 RETURNING id',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Delete class error:', error)
      throw error
    }
  }

  // Get students in class
  static async getStudents(classId) {
    try {
      const result = await pool.query(
        `SELECT s.*, u.name as teacher_name
         FROM students s
         LEFT JOIN users u ON s.teacher_id = u.id
         WHERE s.class_id = $1 AND s.status = 'active'
         ORDER BY s.full_name`,
        [classId]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get class students error:', error)
      throw error
    }
  }

  // Get classes by teacher
  static async findByTeacher(teacherId) {
    try {
      const result = await pool.query(
        `SELECT c.*, COUNT(s.id) as student_count
         FROM classes c
         LEFT JOIN students s ON c.id = s.class_id AND s.status = 'active'
         WHERE c.teacher_id = $1
         GROUP BY c.id
         ORDER BY c.name`,
        [teacherId]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Find classes by teacher error:', error)
      throw error
    }
  }
}

module.exports = Class