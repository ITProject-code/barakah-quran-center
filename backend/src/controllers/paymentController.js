const pool = require('../config/database')

// @desc    Create payment
// @route   POST /api/payments
// @access  Private (Admin)
const createPayment = async (req, res) => {
  try {
    const {
      studentId,
      amount,
      paymentDate,
      paymentType,
      paymentMethod,
      status,
      referenceNumber,
      notes
    } = req.body

    if (!studentId || !amount || !paymentType) {
      return res.status(400).json({ message: 'Student ID, amount, and payment type are required' })
    }

    // Get student's class_id
    const studentResult = await pool.query(
      'SELECT class_id FROM students WHERE id = $1',
      [studentId]
    )
    const classId = studentResult.rows[0]?.class_id || null

    // Get active academic year
    const activeYear = await pool.query(
      'SELECT * FROM academic_years WHERE is_active = true LIMIT 1'
    )
    const yearId = activeYear.rows[0]?.id || null

    const result = await pool.query(
      `INSERT INTO payments (
        student_id, class_id, amount, payment_date,
        payment_type, payment_method, status,
        reference_number, notes, recorded_by, year_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [studentId, classId, amount, paymentDate, paymentType, paymentMethod, status, referenceNumber, notes, req.user.id, yearId]
    )

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      payment: result.rows[0]
    })
  } catch (error) {
    console.error('❌ Create payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin)
const getPayments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        s.full_name as student_name, 
        s.student_id as student_id_num,
        u.name as recorded_by_name,
        c.name as class_name
       FROM payments p
       LEFT JOIN students s ON p.student_id = s.id
       LEFT JOIN users u ON p.recorded_by = u.id
       LEFT JOIN classes c ON p.class_id = c.id
       ORDER BY p.payment_date DESC`
    )
    res.json({ success: true, count: result.rows.length, payments: result.rows })
  } catch (error) {
    console.error('❌ Get payments error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private (Admin)
const getPayment = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        s.full_name as student_name, 
        s.student_id as student_id_num,
        u.name as recorded_by_name,
        c.name as class_name
       FROM payments p
       LEFT JOIN students s ON p.student_id = s.id
       LEFT JOIN users u ON p.recorded_by = u.id
       LEFT JOIN classes c ON p.class_id = c.id
       WHERE p.id = $1`,
      [req.params.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' })
    }
    res.json({ success: true, payment: result.rows[0] })
  } catch (error) {
    console.error('❌ Get payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get payments by student
// @route   GET /api/payments/student/:studentId
// @access  Private (Admin)
const getPaymentsByStudent = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        u.name as recorded_by_name,
        c.name as class_name
       FROM payments p
       LEFT JOIN users u ON p.recorded_by = u.id
       LEFT JOIN classes c ON p.class_id = c.id
       WHERE p.student_id = $1
       ORDER BY p.payment_date DESC`,
      [req.params.studentId]
    )
    res.json({ success: true, count: result.rows.length, payments: result.rows })
  } catch (error) {
    console.error('❌ Get payments by student error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get payment summary
// @route   GET /api/payments/summary
// @access  Private (Admin)
const getPaymentSummary = async (req, res) => {
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
         COUNT(DISTINCT student_id) as unique_students,
         COUNT(CASE WHEN payment_type = 'monthly' THEN 1 END) as monthly_count,
         COUNT(CASE WHEN payment_type = 'registration' THEN 1 END) as registration_count
       FROM payments`
    )
    res.json({ success: true, summary: result.rows[0] })
  } catch (error) {
    console.error('❌ Get payment summary error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get student payment summary// @route   GET /api/payments/student/:studentId/summary
// @access  Private (Admin)
const getStudentPaymentSummary = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_payments,
         SUM(amount) as total_paid,
         COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
         COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
         COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid_amount
       FROM payments
       WHERE student_id = $1`,
      [req.params.studentId]
    )
    res.json({ success: true, summary: result.rows[0] })
  } catch (error) {
    console.error('❌ Get student payment summary error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get monthly payment summary
// @route   GET /api/payments/monthly
// @access  Private (Admin)
const getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query
    const currentYear = year || new Date().getFullYear()
    const currentMonth = month || new Date().getMonth() + 1
    
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
      [currentYear, currentMonth]
    )
    res.json({ success: true, summary: result.rows })
  } catch (error) {
    console.error('❌ Get monthly summary error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private (Admin)
const updatePayment = async (req, res) => {
  try {
    const {
      amount,
      paymentDate,
      paymentType,
      paymentMethod,
      status,
      referenceNumber,
      notes
    } = req.body

    const result = await pool.query(
      `UPDATE payments SET
        amount = $1, payment_date = $2,
        payment_type = $3, payment_method = $4, status = $5,
        reference_number = $6, notes = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [amount, paymentDate, paymentType, paymentMethod, status, referenceNumber, notes, req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    res.json({
      success: true,
      message: 'Payment updated successfully',
      payment: result.rows[0]
    })
  } catch (error) {
    console.error('❌ Update payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private (Admin)
const deletePayment = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM payments WHERE id = $1 RETURNING id',
      [req.params.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' })
    }
    res.json({ success: true, message: 'Payment deleted successfully' })
  } catch (error) {
    console.error('❌ Delete payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get class payment status for current month
// @route   GET /api/payments/class/:classId/status
// @access  Private (Admin)
const getClassPaymentStatus = async (req, res) => {
  try {
    const { classId } = req.params
    const { month, year } = req.query
    
    const currentMonth = month || new Date().getMonth() + 1
    const currentYear = year || new Date().getFullYear()
    
    // Get active academic year
    const activeYear = await pool.query(
      'SELECT * FROM academic_years WHERE is_active = true LIMIT 1'
    )
    const yearId = activeYear.rows[0]?.id || null
    const defaultAmount = activeYear.rows[0]?.default_monthly_amount || 500
    
    // Get class details
    const classResult = await pool.query(
      'SELECT * FROM classes WHERE id = $1',
      [classId]
    )
    const classData = classResult.rows[0]
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' })
    }
    
    // Get all students in class
    const studentsResult = await pool.query(
      `SELECT s.*, u.name as teacher_name
       FROM students s
       LEFT JOIN users u ON s.teacher_id = u.id
       WHERE s.class_id = $1 AND s.status = 'active'
       ORDER BY s.full_name`,
      [classId]
    )
    
    const students = studentsResult.rows
    
    // Get payments for this month and year
    const monthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`
    const monthEnd = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${new Date(currentYear, currentMonth, 0).getDate()}`
    
    const paymentsResult = await pool.query(
      `SELECT p.*, s.full_name as student_name
       FROM payments p
       JOIN students s ON p.student_id = s.id
       WHERE p.class_id = $1 
         AND p.payment_date BETWEEN $2 AND $3
         AND p.payment_type = 'monthly'`,
      [classId, monthStart, monthEnd]
    )
    
    const payments = paymentsResult.rows
    
    // Combine data
    const studentsWithStatus = students.map(student => {
      const payment = payments.find(p => p.student_id === student.id)
      return {
        id: student.id,
        full_name: student.full_name,
        student_id: student.student_id,
        guardian_name: student.guardian_name,
        guardian_phone: student.guardian_phone,
        teacher_name: student.teacher_name,
        defaultAmount: defaultAmount,
        paymentStatus: payment ? payment.status : 'unpaid',
        paymentAmount: payment ? payment.amount : null,
        paymentId: payment ? payment.id : null,
        paymentDate: payment ? payment.payment_date : null
      }
    })
    
    const paidStudents = studentsWithStatus.filter(s => s.paymentStatus === 'paid')
    const unpaidStudents = studentsWithStatus.filter(s => s.paymentStatus === 'unpaid')
    const partialStudents = studentsWithStatus.filter(s => s.paymentStatus === 'partial')
    
    res.json({
      success: true,
      class: classData,
      month: currentMonth,
      year: currentYear,
      monthName: new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' }),
      students: studentsWithStatus,
      summary: {
        totalStudents: students.length,
        paid: paidStudents.length,
        unpaid: unpaidStudents.length,
        partial: partialStudents.length,
        paidStudents: paidStudents.map(s => ({ id: s.id, name: s.full_name })),
        unpaidStudents: unpaidStudents.map(s => ({ id: s.id, name: s.full_name })),
        totalAmount: paidStudents.reduce((sum, s) => sum + (s.paymentAmount || 0), 0)
      }
    })
  } catch (error) {
    console.error('❌ Get class payment status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get active academic year with settings
// @route   GET /api/payments/settings
// @access  Private (Admin)
const getPaymentSettings = async (req, res) => {
  try {
    const activeYear = await pool.query(
      'SELECT * FROM academic_years WHERE is_active = true LIMIT 1'
    )
    const allYears = await pool.query(
      'SELECT * FROM academic_years ORDER BY year DESC'
    )
    
    res.json({
      success: true,
      activeYear: activeYear.rows[0] || null,
      allYears: allYears.rows
    })
  } catch (error) {
    console.error('❌ Get payment settings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update payment settings
// @route   PUT /api/payments/settings
// @access  Private (Admin)
const updatePaymentSettings = async (req, res) => {
  try {
    const { yearId, defaultAmount, newYear } = req.body
    
    // If new year is provided, create it
    if (newYear) {
      await pool.query(
        'INSERT INTO academic_years (year, default_monthly_amount) VALUES ($1, $2)',
        [newYear, defaultAmount || 500]
      )
    }
    
    // Update default amount for active year
    if (yearId && defaultAmount) {
      await pool.query(
        'UPDATE academic_years SET default_monthly_amount = $1 WHERE id = $2',
        [defaultAmount, yearId]
      )
    }
    
    const activeYear = await pool.query(
      'SELECT * FROM academic_years WHERE is_active = true LIMIT 1'
    )
    const allYears = await pool.query(
      'SELECT * FROM academic_years ORDER BY year DESC'
    )
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      activeYear: activeYear.rows[0] || null,
      allYears: allYears.rows
    })
  } catch (error) {
    console.error('❌ Update payment settings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Set active academic year
// @route   POST /api/payments/set-active-year
// @access  Private (Admin)
const setActiveYear = async (req, res) => {
  try {
    const { yearId } = req.body
    
    if (!yearId) {
      return res.status(400).json({ message: 'Year ID is required' })
    }
    
    // Deactivate all years
    await pool.query('UPDATE academic_years SET is_active = false')
    
    // Activate selected year
    await pool.query(
      'UPDATE academic_years SET is_active = true WHERE id = $1',
      [yearId]
    )
    
    const activeYear = await pool.query(
      'SELECT * FROM academic_years WHERE is_active = true LIMIT 1'
    )
    
    res.json({
      success: true,
      message: 'Active year updated successfully',
      activeYear: activeYear.rows[0] || null
    })
  } catch (error) {
    console.error('❌ Set active year error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Bulk record monthly payments for a class
// @route   POST /api/payments/class/bulk
// @access  Private (Admin)
const bulkRecordMonthlyPayments = async (req, res) => {
  try {
    const { classId, month, year, amount } = req.body
    const recordedBy = req.user.id
    
    const currentMonth = month || new Date().getMonth() + 1
    const currentYear = year || new Date().getFullYear()
    
    // Get active academic year
    const activeYear = await pool.query(
      'SELECT * FROM academic_years WHERE is_active = true LIMIT 1'
    )
    const yearId = activeYear.rows[0]?.id || null
    const defaultAmount = activeYear.rows[0]?.default_monthly_amount || 500
    
    // Get all students in class
    const studentsResult = await pool.query(
      'SELECT id FROM students WHERE class_id = $1 AND status = $2',
      [classId, 'active']
    )
    
    const students = studentsResult.rows
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found in this class' })
    }
    
    // Check if payments already exist for this month
    const monthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`
    const monthEnd = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${new Date(currentYear, currentMonth, 0).getDate()}`
    
    const existingPayments = await pool.query(
      `SELECT student_id FROM payments 
       WHERE class_id = $1 
         AND payment_date BETWEEN $2 AND $3
         AND payment_type = 'monthly'`,
      [classId, monthStart, monthEnd]
    )
    
    const existingStudentIds = existingPayments.rows.map(p => p.student_id)
    
    // Create payments only for students who don't have one yet
    const results = []
    let createdCount = 0
    
    for (const student of students) {
      if (!existingStudentIds.includes(student.id)) {
        const result = await pool.query(
          `INSERT INTO payments (
            student_id, class_id, amount, payment_date,
            payment_type, status, year_id, recorded_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *`,
          [
            student.id,
            classId,
            amount || defaultAmount,
            `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
            'monthly',
            'unpaid',
            yearId,
            recordedBy
          ]
        )
        results.push(result.rows[0])
        createdCount++
      }
    }
    
    res.status(201).json({
      success: true,
      message: `Monthly payments created for ${createdCount} students`,
      count: createdCount,
      results
    })
  } catch (error) {
    console.error('❌ Bulk record monthly payments error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  getPaymentsByStudent,
  getPaymentSummary,
  getStudentPaymentSummary,
  getMonthlySummary,
  updatePayment,
  deletePayment,
  getClassPaymentStatus,
  getPaymentSettings,
  updatePaymentSettings,
  setActiveYear,
  bulkRecordMonthlyPayments
}