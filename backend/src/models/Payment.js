const pool = require('../config/database')

class Payment {
  // Create new payment
  static async create(paymentData) {
    try {
      const {
        studentId,
        amount,
        paymentDate,
        dueDate,
        paymentType,
        paymentMethod,
        status,
        referenceNumber,
        notes,
        recordedBy
      } = paymentData

      const result = await pool.query(
        `INSERT INTO payments (
          student_id, amount, payment_date, due_date,
          payment_type, payment_method, status,
          reference_number, notes, recorded_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [studentId, amount, paymentDate, dueDate, paymentType, paymentMethod, status, referenceNumber, notes, recordedBy]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Create payment error:', error)
      throw error
    }
  }

  // Get all payments
  static async findAll() {
    try {
      const result = await pool.query(
        `SELECT p.*, 
          s.full_name as student_name, 
          s.student_id as student_id_num,
          u.name as recorded_by_name
         FROM payments p
         LEFT JOIN students s ON p.student_id = s.id
         LEFT JOIN users u ON p.recorded_by = u.id
         ORDER BY p.payment_date DESC`
      )
      return result.rows
    } catch (error) {
      console.error('❌ Find all payments error:', error)
      throw error
    }
  }

  // Find payment by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        `SELECT p.*, 
          s.full_name as student_name, 
          s.student_id as student_id_num,
          u.name as recorded_by_name
         FROM payments p
         LEFT JOIN students s ON p.student_id = s.id
         LEFT JOIN users u ON p.recorded_by = u.id
         WHERE p.id = $1`,
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Find payment by ID error:', error)
      throw error
    }
  }

  // Get payments by student
  static async findByStudent(studentId) {
    try {
      const result = await pool.query(
        `SELECT p.*, 
          s.full_name as student_name,
          u.name as recorded_by_name
         FROM payments p
         LEFT JOIN students s ON p.student_id = s.id
         LEFT JOIN users u ON p.recorded_by = u.id
         WHERE p.student_id = $1
         ORDER BY p.payment_date DESC`,
        [studentId]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Find payments by student error:', error)
      throw error
    }
  }

  // Get payments by date range
  static async findByDateRange(startDate, endDate) {
    try {
      const result = await pool.query(
        `SELECT p.*, 
          s.full_name as student_name,
          s.student_id as student_id_num
         FROM payments p
         LEFT JOIN students s ON p.student_id = s.id
         WHERE p.payment_date BETWEEN $1 AND $2
         ORDER BY p.payment_date DESC`,
        [startDate, endDate]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Find payments by date range error:', error)
      throw error
    }
  }

  // Get payment summary/statistics
  static async getSummary() {
    try {
      const result = await pool.query(
        `SELECT 
           COUNT(*) as total_payments,
           SUM(amount) as total_amount,
           AVG(amount) as average_amount,
           COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
           COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
           COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
           SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_amount,
           SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
           COUNT(DISTINCT student_id) as unique_students,
           COUNT(CASE WHEN payment_type = 'monthly' THEN 1 END) as monthly_count,
           COUNT(CASE WHEN payment_type = 'registration' THEN 1 END) as registration_count
         FROM payments`
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Get payment summary error:', error)
      throw error
    }
  }

  // Get monthly payment summary
  static async getMonthlySummary(year, month) {
    try {
      const result = await pool.query(
        `SELECT 
           payment_type,
           COUNT(*) as count,
           SUM(amount) as total_amount,
           COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
           SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_amount
         FROM payments
         WHERE EXTRACT(YEAR FROM payment_date) = $1
           AND EXTRACT(MONTH FROM payment_date) = $2
         GROUP BY payment_type
         ORDER BY payment_type`,
        [year, month]
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get monthly summary error:', error)
      throw error
    }
  }

  // Update payment
  static async update(id, paymentData) {
    try {
      const {
        amount,
        paymentDate,
        dueDate,
        paymentType,
        paymentMethod,
        status,
        referenceNumber,
        notes
      } = paymentData

      const result = await pool.query(
        `UPDATE payments SET
          amount = $1, payment_date = $2, due_date = $3,
          payment_type = $4, payment_method = $5, status = $6,
          reference_number = $7, notes = $8,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *`,
        [amount, paymentDate, dueDate, paymentType, paymentMethod, status, referenceNumber, notes, id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Update payment error:', error)
      throw error
    }
  }

  // Delete payment
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM payments WHERE id = $1 RETURNING id',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Delete payment error:', error)
      throw error
    }
  }

  // Get student payment summary
  static async getStudentSummary(studentId) {
    try {
      const result = await pool.query(
        `SELECT 
           COUNT(*) as total_payments,
           SUM(amount) as total_paid,
           COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
           COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
           COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
           SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid_amount,
           SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending_amount
         FROM payments
         WHERE student_id = $1`,
        [studentId]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Get student payment summary error:', error)
      throw error
    }
  }
}

module.exports = Payment