require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./config/database')

// Import routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const studentRoutes = require('./routes/studentRoutes')
const classRoutes = require('./routes/classRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const teacherAttendanceRoutes = require('./routes/teacherAttendanceRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const academicYearRoutes = require('./routes/academicYearRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// ✅ FIXED CORS - Allow all Vercel domains and local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://barakah-quran-center.vercel.app',
  'https://barakah-quran-center-git-main.vercel.app',
  'https://barakah-quran-center-5wrxnqg4s-itp-roject-code.vercel.app'
]

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      // Allow any Vercel preview URL (contains .vercel.app)
      if (origin.includes('.vercel.app')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`)
  next()
})

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack)
  } else {
    console.log('✅ Database connected successfully')
    release()
  }
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/teacher-attendance', teacherAttendanceRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/academic-years', academicYearRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Barakah Center API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.DATABASE_URL ? 'Neon (Production)' : 'Local'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack)
  res.status(500).json({ success: false, message: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})