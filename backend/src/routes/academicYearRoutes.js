const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const { auth, checkRole } = require('../middleware/auth')

// Get all academic years
router.get('/', auth, checkRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM academic_years ORDER BY year DESC'
    )
    res.json({ success: true, years: result.rows })
  } catch (error) {
    console.error('❌ Get academic years error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get active academic year
router.get('/active', auth, checkRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM academic_years WHERE is_active = true LIMIT 1'
    )
    res.json({ success: true, active: result.rows[0] || null })
  } catch (error) {
    console.error('❌ Get active year error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create academic year
router.post('/', auth, checkRole('admin'), async (req, res) => {
  try {
    const { year, default_monthly_amount } = req.body
    
    if (!year) {
      return res.status(400).json({ message: 'Year is required' })
    }
    
    // Check if year already exists
    const existing = await pool.query(
      'SELECT * FROM academic_years WHERE year = $1',
      [year]
    )
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Academic year already exists' })
    }
    
    const result = await pool.query(
      `INSERT INTO academic_years (year, default_monthly_amount)
       VALUES ($1, $2)
       RETURNING *`,
      [year, default_monthly_amount || 500]
    )
    
    res.status(201).json({
      success: true,
      message: 'Academic year created successfully',
      year: result.rows[0]
    })
  } catch (error) {
    console.error('❌ Create academic year error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update academic year (for default amount)
router.put('/:id', auth, checkRole('admin'), async (req, res) => {
  try {
    const { default_monthly_amount, is_active, year } = req.body
    const id = req.params.id
    
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
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Academic year not found' })
    }
    
    res.json({
      success: true,
      message: 'Academic year updated successfully',
      year: result.rows[0]
    })
  } catch (error) {
    console.error('❌ Update academic year error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Set active year
router.put('/:id/active', auth, checkRole('admin'), async (req, res) => {
  try {
    // Deactivate all years
    await pool.query('UPDATE academic_years SET is_active = false')
    
    // Activate selected year
    const result = await pool.query(
      'UPDATE academic_years SET is_active = true WHERE id = $1 RETURNING *',
      [req.params.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Academic year not found' })
    }
    
    res.json({
      success: true,
      message: 'Active year updated successfully',
      active: result.rows[0]
    })
  } catch (error) {
    console.error('❌ Set active year error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete academic year
router.delete('/:id', auth, checkRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM academic_years WHERE id = $1 RETURNING id',
      [req.params.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Academic year not found' })
    }
    
    res.json({
      success: true,
      message: 'Academic year deleted successfully'
    })
  } catch (error) {
    console.error('❌ Delete academic year error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router