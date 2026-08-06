const pool = require('../config/database')

class AcademicYear {
  // Create new academic year
  static async create(yearData) {
    try {
      const { year, default_monthly_amount } = yearData
      
      const result = await pool.query(
        `INSERT INTO academic_years (year, default_monthly_amount)
         VALUES ($1, $2)
         RETURNING *`,
        [year, default_monthly_amount || 500]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Create academic year error:', error)
      throw error
    }
  }

  // Get all academic years
  static async findAll() {
    try {
      const result = await pool.query(
        'SELECT * FROM academic_years ORDER BY year DESC'
      )
      return result.rows
    } catch (error) {
      console.error('❌ Get academic years error:', error)
      throw error
    }
  }

  // Get active academic year
  static async getActive() {
    try {
      const result = await pool.query(
        'SELECT * FROM academic_years WHERE is_active = true LIMIT 1'
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Get active academic year error:', error)
      throw error
    }
  }

  // Update academic year
  static async update(id, yearData) {
    try {
      const { year, default_monthly_amount, is_active } = yearData
      
      let query = 'UPDATE academic_years SET updated_at = CURRENT_TIMESTAMP'
      const values = []
      let paramCount = 1
      
      if (year !== undefined) {
        query += `, year = $${paramCount}`
        values.push(year)
        paramCount++
      }
      if (default_monthly_amount !== undefined) {
        query += `, default_monthly_amount = $${paramCount}`
        values.push(default_monthly_amount)
        paramCount++
      }
      if (is_active !== undefined) {
        query += `, is_active = $${paramCount}`
        values.push(is_active)
        paramCount++
      }
      
      query += ` WHERE id = $${paramCount} RETURNING *`
      values.push(id)
      
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      console.error('❌ Update academic year error:', error)
      throw error
    }
  }

  // Set active year (deactivate all others)
  static async setActive(id) {
    try {
      await pool.query('UPDATE academic_years SET is_active = false')
      const result = await pool.query(
        'UPDATE academic_years SET is_active = true WHERE id = $1 RETURNING *',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Set active year error:', error)
      throw error
    }
  }

  // Delete academic year
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM academic_years WHERE id = $1 RETURNING id',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('❌ Delete academic year error:', error)
      throw error
    }
  }
}

module.exports = AcademicYear