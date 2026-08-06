const express = require('express')
const router = express.Router()
const { 
  login, 
  getMe, 
  register, 
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  adminResetPassword
} = require('../controllers/authController')
const { auth, checkRole } = require('../middleware/auth')

// Public routes
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.get('/verify-reset-token/:token', verifyResetToken)
router.post('/reset-password', resetPassword)

// Protected routes
router.get('/me', auth, getMe)
router.post('/change-password', auth, changePassword)

// Admin only routes
router.post('/register', auth, checkRole('admin'), register)
router.post('/admin-reset-password', auth, checkRole('admin'), adminResetPassword)

module.exports = router