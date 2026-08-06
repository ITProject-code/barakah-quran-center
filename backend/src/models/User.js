const pool = require('../config/database')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

class User {
  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ findByEmail error:', error)
      throw error
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, role, phone, created_at, must_change_password FROM users WHERE id = $1',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ findById error:', error)
      throw error
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { name, email, password, role, phone, mustChangePassword = true } = userData
      
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const result = await pool.query(
        `INSERT INTO users (name, email, password, role, phone, must_change_password) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, name, email, role, phone, created_at`,
        [name, email, hashedPassword, role, phone, mustChangePassword]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ create error:', error)
      throw error
    }
  }

  // Update user
  static async update(id, userData) {
    try {
      const { name, phone, role } = userData
      
      const result = await pool.query(
        `UPDATE users 
         SET name = $1, phone = $2, role = $3, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $4 
         RETURNING id, name, email, role, phone, created_at`,
        [name, phone, role, id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ update error:', error)
      throw error
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ delete error:', error)
      throw error
    }
  }

  // Get all users
  static async findAll() {
    try {
      const result = await pool.query(
        'SELECT id, name, email, role, phone, created_at, must_change_password FROM users ORDER BY created_at DESC'
      )
      return result.rows
    } catch (error) {
      console.error('❌ findAll error:', error)
      throw error
    }
  }

  // Get users by role
  static async findByRole(role) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, role, phone, created_at, must_change_password FROM users WHERE role = $1 ORDER BY name',
        [role]
      )
      return result.rows
    } catch (error) {
      console.error('❌ findByRole error:', error)
      throw error
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
      console.error('❌ verifyPassword error:', error)
      return false
    }
  }

  // Generate reset token
  static async generateResetToken(email) {
    try {
      const token = crypto.randomBytes(32).toString('hex')
      const expiry = new Date(Date.now() + 3600000) // 1 hour from now
      
      const result = await pool.query(
        `UPDATE users 
         SET reset_token = $1, reset_token_expiry = $2, reset_token_used = false 
         WHERE email = $3 
         RETURNING id, email, name`,
        [token, expiry, email]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Generate reset token error:', error)
      throw error
    }
  }

  // Verify reset token
  static async verifyResetToken(token) {
    try {
      const result = await pool.query(
        `SELECT id, email, name FROM users 
         WHERE reset_token = $1 
           AND reset_token_expiry > NOW() 
           AND reset_token_used = false`,
        [token]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Verify reset token error:', error)
      throw error
    }
  }

  // Reset password with token
  static async resetPassword(token, newPassword) {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      
      const result = await pool.query(
        `UPDATE users 
         SET password = $1, reset_token = NULL, reset_token_expiry = NULL, reset_token_used = true 
         WHERE reset_token = $2 
           AND reset_token_expiry > NOW() 
           AND reset_token_used = false
         RETURNING id, email, name`,
        [hashedPassword, token]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Reset password error:', error)
      throw error
    }
  }

  // Admin: Reset teacher password
  static async adminResetPassword(userId, newPassword) {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      
      const result = await pool.query(
        `UPDATE users 
         SET password = $1, must_change_password = true, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND role = 'teacher'
         RETURNING id, name, email`,
        [hashedPassword, userId]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Admin reset password error:', error)
      throw error
    }
  }
}

module.exports = User