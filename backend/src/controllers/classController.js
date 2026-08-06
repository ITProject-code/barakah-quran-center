const Class = require('../models/Class')

// @desc    Create class
// @route   POST /api/classes
// @access  Private (Admin)
const createClass = async (req, res) => {
  try {
    const { name, description, level, teacher_id, max_students } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Class name is required' })
    }

    const classData = await Class.create({
      name,
      description,
      level,
      teacher_id,
      max_students
    })

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      class: classData
    })
  } catch (error) {
    console.error('❌ Create class error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private (Admin/Teacher)
const getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll()
    res.json({ success: true, count: classes.length, classes })
  } catch (error) {
    console.error('❌ Get classes error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Private (Admin/Teacher)
const getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' })
    }
    res.json({ success: true, class: classData })
  } catch (error) {
    console.error('❌ Get class error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get students in class
// @route   GET /api/classes/:id/students
// @access  Private (Admin/Teacher)
const getClassStudents = async (req, res) => {
  try {
    const students = await Class.getStudents(req.params.id)
    res.json({ success: true, count: students.length, students })
  } catch (error) {
    console.error('❌ Get class students error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (Admin)
const updateClass = async (req, res) => {
  try {
    const { name, description, level, teacher_id, max_students, status } = req.body

    const classData = await Class.update(req.params.id, {
      name,
      description,
      level,
      teacher_id,
      max_students,
      status
    })

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' })
    }

    res.json({
      success: true,
      message: 'Class updated successfully',
      class: classData
    })
  } catch (error) {
    console.error('❌ Update class error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Admin)
const deleteClass = async (req, res) => {
  try {
    const classData = await Class.delete(req.params.id)
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' })
    }
    res.json({ success: true, message: 'Class deleted successfully' })
  } catch (error) {
    console.error('❌ Delete class error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get classes by teacher
// @route   GET /api/classes/teacher/:teacherId
// @access  Private (Teacher)
const getClassesByTeacher = async (req, res) => {
  try {
    const classes = await Class.findByTeacher(req.params.teacherId)
    res.json({ success: true, count: classes.length, classes })
  } catch (error) {
    console.error('❌ Get classes by teacher error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  createClass,
  getClasses,
  getClass,
  getClassStudents,
  updateClass,
  deleteClass,
  getClassesByTeacher
}