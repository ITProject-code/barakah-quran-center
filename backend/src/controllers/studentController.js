const Student = require('../models/Student')

// @desc    Create student
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res) => {
  try {
    const {
      fullName,
      arabicName,
      birthDate,
      guardianName,
      guardianPhone,
      address,
      enrollmentDate,
      classId,
      teacherId,
      notes
    } = req.body

    // Validate required fields
    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required' })
    }

    // Generate student ID
    const studentId = Student.generateStudentId()

    // Check if student ID already exists
    const existingStudent = await Student.findByStudentId(studentId)
    if (existingStudent) {
      // If duplicate, generate new one
      studentId = Student.generateStudentId()
    }

    const student = await Student.create({
      fullName,
      arabicName,
      studentId,
      birthDate,
      guardianName,
      guardianPhone,
      address,
      enrollmentDate: enrollmentDate || new Date(),
      classId,
      teacherId,
      notes
    })

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      student
    })
  } catch (error) {
    console.error('❌ Create student error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin/Teacher)
const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll()
    res.json({ success: true, count: students.length, students })
  } catch (error) {
    console.error('❌ Get students error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private (Admin/Teacher)
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json({ success: true, student })
  } catch (error) {
    console.error('❌ Get student error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get students by teacher
// @route   GET /api/students/teacher/:teacherId
// @access  Private (Teacher)
const getStudentsByTeacher = async (req, res) => {
  try {
    const students = await Student.findByTeacher(req.params.teacherId)
    res.json({ success: true, count: students.length, students })
  } catch (error) {
    console.error('❌ Get students by teacher error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin/Teacher)
const updateStudent = async (req, res) => {
  try {
    const {
      fullName,
      arabicName,
      birthDate,
      guardianName,
      guardianPhone,
      address,
      classId,
      teacherId,
      notes,
      status
    } = req.body

    const student = await Student.update(req.params.id, {
      fullName,
      arabicName,
      birthDate,
      guardianName,
      guardianPhone,
      address,
      classId,
      teacherId,
      notes,
      status
    })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      student
    })
  } catch (error) {
    console.error('❌ Update student error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.delete(req.params.id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json({ success: true, message: 'Student deleted successfully' })
  } catch (error) {
    console.error('❌ Delete student error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Search students
// @route   GET /api/students/search/:query
// @access  Private (Admin/Teacher)
const searchStudents = async (req, res) => {
  try {
    const students = await Student.search(req.params.query)
    res.json({ success: true, count: students.length, students })
  } catch (error) {
    console.error('❌ Search students error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  getStudentsByTeacher,
  updateStudent,
  deleteStudent,
  searchStudents
}