const express = require('express')
const router = express.Router()
const {
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
  bulkRecordMonthlyPayments
} = require('../controllers/paymentController')
const { auth, checkRole } = require('../middleware/auth')

// All routes require authentication and admin role
router.use(auth, checkRole('admin'))

// Payment settings
router.get('/settings', getPaymentSettings)
router.put('/settings', updatePaymentSettings)

// Class payment status
router.get('/class/:classId/status', getClassPaymentStatus)

// Bulk monthly payments
router.post('/class/bulk', bulkRecordMonthlyPayments)

// Payment summary
router.get('/summary', getPaymentSummary)

// Monthly summary
router.get('/monthly', getMonthlySummary)

// Payments by student
router.get('/student/:studentId', getPaymentsByStudent)

// Student payment summary
router.get('/student/:studentId/summary', getStudentPaymentSummary)

// Get all payments
router.get('/', getPayments)

// Get single payment
router.get('/:id', getPayment)

// Create payment
router.post('/', createPayment)

// Update payment
router.put('/:id', updatePayment)

// Delete payment
router.delete('/:id', deletePayment)

module.exports = router