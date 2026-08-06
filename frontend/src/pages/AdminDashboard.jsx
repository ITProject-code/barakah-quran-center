import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../utils/translate'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { 
  FaUsers, FaChalkboardTeacher, FaBook, FaMoneyBillWave, 
  FaCheckCircle, FaTimesCircle, FaUserPlus, FaChartLine,
  FaUserGraduate, FaCalendarCheck, FaClipboardList,
  FaFileAlt, FaQuran, FaWallet, FaPlusCircle,
  FaUserClock, FaClock
} from 'react-icons/fa'

const AdminDashboard = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0])
  const [teacherAttendance, setTeacherAttendance] = useState({
    totalTeachers: 0,
    presentTeachers: 0,
    absentTeachers: 0,
    lateTeachers: 0,
    excusedTeachers: 0,
    teachers: []
  })
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeClasses: 0,
    presentToday: 0,
    absentToday: 0,
    monthlyIncome: 0,
    newAdmissions: 0,
    attendanceRate: 0,
    recentActivity: []
  })

  const daysOfWeek = isArabic ? ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'] : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const studentsRes = await api.get('/students')
      const students = studentsRes.data.students || []
      
      const teachersRes = await api.get('/users/role/teacher')
      const teachers = teachersRes.data.users || []
      const totalTeachers = teachers.length

      const classesRes = await api.get('/classes')
      const classes = classesRes.data.classes || []
      const activeClassesCount = classes.filter(c => c.status === 'active').length

      let monthlyIncome = 0
      try {
        const paymentRes = await api.get('/payments/summary')
        monthlyIncome = paymentRes.data.summary?.paid_amount || 0
      } catch (error) {
        console.log('No payment data yet')
      }

      let presentToday = 0
      let absentToday = 0
      let attendanceRate = 0

      try {
        const today = new Date().toISOString().split('T')[0]
        const attendanceRes = await api.get(`/attendance/date?date=${today}`)
        const attendanceData = attendanceRes.data.attendance || []
        presentToday = attendanceData.filter(a => a.status === 'present').length
        absentToday = attendanceData.filter(a => a.status === 'absent').length
        const totalToday = presentToday + absentToday
        attendanceRate = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0
      } catch (error) {
        console.log('No attendance data yet')
      }

      await fetchTeacherAttendance(teachers)
      await fetchWeeklyAttendance()

      const totalStudents = students.length
      const newAdmissions = students.filter(s => {
        const date = new Date(s.created_at)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }).length

      const recentActivity = students.slice(0, 5).map(s => ({
        id: s.id,
        name: s.full_name,
        action: t('New student registered', lang),
        time: new Date(s.created_at).toLocaleDateString()
      }))

      setStats({
        totalStudents,
        totalTeachers,
        activeClasses: activeClassesCount,
        presentToday,
        absentToday,
        monthlyIncome,
        newAdmissions,
        attendanceRate,
        recentActivity
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeacherAttendance = async (teachers) => {
    try {
      let presentTeachers = 0
      let absentTeachers = 0
      let lateTeachers = 0
      let excusedTeachers = 0
      const teacherData = []

      for (const teacher of teachers) {
        try {
          const response = await api.get('/teacher-attendance/today')
          
          const attendanceList = response.data.attendance || []
          const teacherAtt = attendanceList.find(a => a.id === teacher.id)
          const status = teacherAtt?.status || 'not_recorded'
          
          if (status === 'present') presentTeachers++
          else if (status === 'absent') absentTeachers++
          else if (status === 'late') lateTeachers++
          else if (status === 'excused') excusedTeachers++
          
          teacherData.push({
            id: teacher.id,
            name: teacher.name,
            status: status
          })
        } catch (error) {
          teacherData.push({
            id: teacher.id,
            name: teacher.name,
            status: 'not_recorded'
          })
        }
      }

      setTeacherAttendance({
        totalTeachers: teachers.length,
        presentTeachers,
        absentTeachers,
        lateTeachers,
        excusedTeachers,
        teachers: teacherData
      })
    } catch (error) {
      console.error('Error fetching teacher attendance:', error)
    }
  }

  const fetchWeeklyAttendance = async () => {
    try {
      const weekly = []
      const today = new Date()
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        try {
          const response = await api.get(`/attendance/date?date=${dateStr}`)
          const attendanceData = response.data.attendance || []
          const presentCount = attendanceData.filter(a => a.status === 'present').length
          const totalCount = attendanceData.length
          const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0
          weekly.push(rate)
        } catch (error) {
          weekly.push(0)
        }
      }
      setWeeklyData(weekly)
    } catch (error) {
      console.error('Error fetching weekly attendance:', error)
      setWeeklyData([0, 0, 0, 0, 0, 0, 0])
    }
  }

  const statCards = [
    { icon: FaUsers, value: stats.totalStudents, label: t('Total Students', lang), color: 'text-primary', bg: 'bg-primary/10', trend: stats.totalStudents > 0 ? '+12%' : '0' },
    { icon: FaChalkboardTeacher, value: stats.totalTeachers, label: t('Total Teachers', lang), color: 'text-gold', bg: 'bg-gold/10', trend: stats.totalTeachers > 0 ? '+2' : '0' },
    { icon: FaBook, value: stats.activeClasses, label: t('Active Classes', lang), color: 'text-primary-dark', bg: 'bg-primary-dark/10', trend: `${stats.activeClasses} active` },
    { icon: FaCheckCircle, value: stats.presentToday, label: t('Present Today', lang), color: 'text-green-600', bg: 'bg-green-100', trend: `${stats.attendanceRate}%` },
    { icon: FaTimesCircle, value: stats.absentToday, label: t('Absent Today', lang), color: 'text-red-500', bg: 'bg-red-100', trend: stats.absentToday > 0 ? '8%' : '0%' },
    { icon: FaMoneyBillWave, value: `${stats.monthlyIncome.toLocaleString()} ETB`, label: t('Monthly Income', lang), color: 'text-gold', bg: 'bg-gold/10', trend: '+6%' },
    { icon: FaUserPlus, value: stats.newAdmissions, label: t('New Admissions', lang), color: 'text-primary', bg: 'bg-primary/10', trend: `+${stats.newAdmissions}` },
    { icon: FaUserClock, value: `${teacherAttendance.presentTeachers}/${teacherAttendance.totalTeachers}`, label: isArabic ? 'المعلمات الحاضرات' : 'Teachers Present', color: 'text-purple-600', bg: 'bg-purple-100', trend: `${Math.round((teacherAttendance.presentTeachers / (teacherAttendance.totalTeachers || 1)) * 100)}%` },
  ]

  const quickActions = [
    { icon: FaUserPlus, label: t('Add Student', lang), color: 'text-primary', bg: 'bg-primary/10', path: '/admin/students/add' },
    { icon: FaChalkboardTeacher, label: t('Add Teacher', lang), color: 'text-gold', bg: 'bg-gold/10', path: '/admin/users' },
    { icon: FaBook, label: t('Create Class', lang), color: 'text-primary-dark', bg: 'bg-primary-dark/10', path: '/admin/classes' },
    { icon: FaCalendarCheck, label: t('Take Attendance', lang), color: 'text-green-600', bg: 'bg-green-100', path: '/admin/attendance' },
    { icon: FaWallet, label: t('Add Payment', lang), color: 'text-emerald-600', bg: 'bg-emerald-100', path: '/admin/payments/add' },
    { icon: FaFileAlt, label: t('Payment Reports', lang), color: 'text-blue-600', bg: 'bg-blue-100', path: '/admin/payments/reports' },
    { icon: FaUsers, label: t('Class Payments', lang), color: 'text-purple-600', bg: 'bg-purple-100', path: '/admin/payments/class-view' },
    { icon: FaPlusCircle, label: t('Attendance Reports', lang), color: 'text-orange-600', bg: 'bg-orange-100', path: '/admin/attendance/reports' },
  ]

  const presentTeachers = teacherAttendance.teachers.filter(t => t.status === 'present')
  const absentTeachers = teacherAttendance.teachers.filter(t => t.status === 'absent')
  const lateTeachers = teacherAttendance.teachers.filter(t => t.status === 'late')
  const excusedTeachers = teacherAttendance.teachers.filter(t => t.status === 'excused')

  const maxValue = Math.max(...weeklyData, 1)

  if (loading) {
    return (
      <DashboardLayout 
        title={t('Admin Dashboard', lang)} 
        subtitle={t('Loading...', lang)}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">{t('Loading...', lang)}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={t('Welcome back, Admin', lang) + ' 👋'} 
      subtitle={`${stats.totalStudents} ${t('students', lang)} · ${stats.totalTeachers} ${t('teachers', lang)} · ${stats.activeClasses} ${t('active classes', lang)}`}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl p-4 border border-beige shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`text-lg ${stat.color}`} />
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{stat.trend}</span>
              </div>
              <div className="text-2xl font-bold text-primary-dark font-english-display">{stat.value}</div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Teacher Attendance Section */}
      <div className="bg-white rounded-xl border border-beige overflow-hidden mb-6">
        <div className="px-6 py-4 bg-beige/30 border-b border-beige flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaUserClock className="text-primary" />
            <h3 className="font-semibold text-primary-dark">
              {isArabic ? 'حضور المعلمات اليوم' : "Today's Teacher Attendance"}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600">
              <FaCheckCircle className="inline mr-1" /> {presentTeachers.length} {isArabic ? 'حاضرة' : 'Present'}
            </span>
            <span className="text-red-500">
              <FaTimesCircle className="inline mr-1" /> {absentTeachers.length} {isArabic ? 'غائبة' : 'Absent'}
            </span>
            <span className="text-yellow-500">
              <FaClock className="inline mr-1" /> {lateTeachers.length} {isArabic ? 'متأخرة' : 'Late'}
            </span>
            <span className="text-muted">
              {isArabic ? 'الإجمالي' : 'Total'}: {teacherAttendance.totalTeachers}
            </span>
          </div>
        </div>
        <div className="p-4">
          {teacherAttendance.totalTeachers === 0 ? (
            <p className="text-muted text-center py-4">{isArabic ? 'لا توجد معلمات' : 'No teachers found'}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {teacherAttendance.teachers.map((teacher) => (
                <div 
                  key={teacher.id} 
                  className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 ${
                    teacher.status === 'present' ? 'bg-green-100 text-green-700' :
                    teacher.status === 'absent' ? 'bg-red-100 text-red-700' :
                    teacher.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                    teacher.status === 'excused' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}
                >
                  {teacher.status === 'present' ? <FaCheckCircle className="text-xs" /> : 
                   teacher.status === 'absent' ? <FaTimesCircle className="text-xs" /> : 
                   teacher.status === 'late' ? <FaClock className="text-xs" /> : 
                   teacher.status === 'excused' ? <FaCheckCircle className="text-xs" /> : 
                   <FaClock className="text-xs" />}
                  {teacher.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-beige">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary-dark">{t('Weekly Attendance', lang)}</h3>
            <button 
              onClick={() => navigate('/admin/attendance/reports')}
              className="text-xs text-primary hover:underline"
            >
              {t('View Reports', lang)} →
            </button>
          </div>
          <div className="flex items-end gap-3 h-32">
            {daysOfWeek.map((day, i) => {
              const height = maxValue > 0 ? Math.max((weeklyData[i] / 100) * 100, 5) : 5
              const isGold = i === 5
              const displayValue = weeklyData[i] || 0
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex flex-col items-center">
                    <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-primary-dark text-white text-xs px-2 py-0.5 rounded">
                      {displayValue}%
                    </div>
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isGold ? 'bg-gold' : 'bg-primary'
                      } hover:opacity-80`}
                      style={{ 
                        height: `${height}%`, 
                        minHeight: '4px',
                        transition: 'height 0.5s ease'
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted">{day}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted mt-2 px-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-beige">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary-dark">{t('Average Memorization Progress', lang)}</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 160 160" className="w-full h-full">
                <circle cx="80" cy="80" r="66" fill="none" stroke="#EDE7DA" strokeWidth="16"/>
                <circle cx="80" cy="80" r="66" fill="none" stroke="#C9A227" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray="414.7" strokeDashoffset="252" transform="rotate(-90 80 80)"/>
                <text x="80" y="76" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="30" fill="#163A2F" fontWeight="700">39%</text>
                <text x="80" y="96" textAnchor="middle" fontSize="10" fill="#66766F">{t('Avg Juz', lang)}</text>
              </svg>
            </div>
            <div className="flex gap-6 mt-3 text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-gold" />
                <span>{t('Completed', lang)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-beige" />
                <span>{t('Remaining', lang)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4">{t('Recent Activity', lang)}</h3>
          {stats.recentActivity.length === 0 ? (
            <p className="text-muted text-sm">{t('No recent activity', lang)}</p>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-muted p-3 bg-beige/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  <span>
                    <strong className="text-text">{activity.name}</strong> — {activity.action}
                    <span className="text-xs text-muted/70 ml-2">{activity.time}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4">{t('Quick Actions', lang)}</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`p-4 ${action.bg} rounded-xl hover:opacity-80 transition-all duration-300 text-center group`}
                >
                  <Icon className={`text-2xl ${action.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-medium text-text">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard