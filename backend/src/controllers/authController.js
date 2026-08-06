const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const pool = require('../config/database')
const User = require('../models/User')

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )
}

// Helper: Generate default password
const generateDefaultPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  console.log('🔐 Login attempt:', req.body)
  
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = await User.findByEmail(email)
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await User.verifyPassword(password, user.password)
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user)

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      mustChangePassword: user.must_change_password || false
    }

    res.json({
      success: true,
      token,
      user: userData
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json({ success: true, user })
  } catch (error) {
    console.error('❌ Get user error:', error)
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
}

// @desc    Register new user (Admin only)
// @route   POST /api/auth/register
// @access  Private (Admin)
const register = async (req, res) => {
  try {
    let { name, phone, role } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Please provide name' })
    }

    let email = name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '.')
      .replace(/\.+/g, '.')
      .replace(/^\.|\.$/g, '')
      + '@barakah.com'

    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      const baseEmail = email.replace('@barakah.com', '')
      let counter = 1
      let newEmail = `${baseEmail}${counter}@barakah.com`
      let userExists = await User.findByEmail(newEmail)
      
      while (userExists) {
        counter++
        newEmail = `${baseEmail}${counter}@barakah.com`
        userExists = await User.findByEmail(newEmail)
      }
      const finalEmail = newEmail
      const defaultPassword = generateDefaultPassword()
      
      const user = await User.create({
        name,
        email: finalEmail,
        password: defaultPassword,
        role: role || 'teacher',
        phone,
        mustChangePassword: true
      })

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          ...user,
          defaultPassword
        }
      })
    } else {
      const defaultPassword = generateDefaultPassword()
      
      const user = await User.create({
        name,
        email,
        password: defaultPassword,
        role: role || 'teacher',
        phone,
        mustChangePassword: true
      })

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          ...user,
          defaultPassword
        }
      })
    }
  } catch (error) {
    console.error('❌ Register error:', error)
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
}

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.id

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    )
    const user = result.rows[0]

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await pool.query(
      'UPDATE users SET password = $1, must_change_password = false, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, userId]
    )

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('❌ Change password error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' })
    }
    
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' })
    }
    
    const updatedUser = await User.generateResetToken(email)
    
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${updatedUser.reset_token}`
    
    console.log(`🔐 Reset link for ${email}: ${resetLink}`)
    
    res.json({
      success: true,
      message: 'Password reset link sent to your email',
      resetToken: updatedUser.reset_token,
      resetLink: resetLink
    })
  } catch (error) {
    console.error('❌ Forgot password error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Verify reset token
// @route   GET /api/auth/verify-reset-token/:token
// @access  Public
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' })
    }
    
    const user = await User.verifyResetToken(token)
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }
    
    res.json({
      success: true,
      message: 'Token is valid',
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error) {
    console.error('❌ Verify reset token error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }
    
    const user = await User.resetPassword(token, newPassword)
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('❌ Reset password error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Admin reset teacher password
// @route   POST /api/auth/admin-reset-password
// @access  Private (Admin only)
const adminResetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body
    
    // Check if requester is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' })
    }
    
    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'User ID and new password are required' })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    
    // Check if user exists and is a teacher
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    if (user.role !== 'teacher') {
      return res.status(400).json({ message: 'Can only reset password for teachers' })
    }
    
    const updatedUser = await User.adminResetPassword(userId, newPassword)
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json({
      success: true,
      message: `Password reset successfully for ${updatedUser.name}`,
      user: updatedUser
    })
  } catch (error) {
    console.error('❌ Admin reset password error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  login,
  getMe,
  register,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  adminResetPassword
}