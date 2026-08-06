const User = require('../models/User')

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll()
    res.json({ success: true, count: users.length, users })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private (Admin)
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params
    const users = await User.findByRole(role)
    res.json({ success: true, count: users.length, users })
  } catch (error) {
    console.error('Get users by role error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ success: true, user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, phone, role } = req.body
    const user = await User.update(req.params.id, { name, phone, role })
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json({ success: true, user })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.delete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getUsers,
  getUsersByRole,
  getUser,
  updateUser,
  deleteUser
}