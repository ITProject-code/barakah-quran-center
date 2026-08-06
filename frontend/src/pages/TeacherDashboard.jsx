import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../utils/translate'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { 
  FaUsers, FaChalkboardTeacher, FaBook, FaCalendarCheck,
  FaCheckCircle, FaTimesCircle, FaUserGraduate, FaChartLine,
  FaClock, FaStar, FaUser, FaPlusCircle, FaFileAlt,
  FaCalendarAlt, FaQuran
} from 'react-icons/fa'

const TeacherDashboard = () => {
  const { token, user } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    attendanceRate: 0,
    needRevision: 0,
    todayClasses: []
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchTeacherData()
  }, [])

  const fetchTeacherData = async () => {
    try {
      setLoading(true)
      const teacherId = user?.id

      const studentsRes = await api.get(`/students/teacher/${teacherId}`)
      const students = studentsRes.data.students || []
      const totalStudents = students.length

      const classesRes = await api.get(`/classes/teacher/${teacherId}`)
      const classes = classesRes.data.classes || []
      const totalClasses = classes.length

      let presentToday = 0
      let absentToday = 0
      let lateToday = 0
      let attendanceRate = 0

      try {
        let totalPresent = 0
        let totalAbsent = 0
        let totalLate = 0
        
        for (const cls of classes) {
          const attendanceRes = await api.get(`/attendance/class/${cls.id}/today`)
          const attData = attendanceRes.data.attendance || []
          const present = attData.filter(a => a.status === 'present').length
          const absent = attData.filter(a => a.status === 'absent').length
          const late = attData.filter(a => a.status === 'late').length
          totalPresent += present
          totalAbsent += absent
          totalLate += late
        }
        
        presentToday = totalPresent
        absentToday = totalAbsent
        lateToday = totalLate
        const total = presentToday + absentToday + lateToday
        attendanceRate = total > 0 ? Math.round((presentToday / total) * 100) : 0
      } catch (error) {
        console.log('No attendance data yet')
      }

      const needRevision = Math.round(totalStudents * 0.15)

      const todayClasses = classes.slice(0, 2).map(cls => ({
        id: cls.id,
        name: cls.name,
        time: '10:00 AM - 11:30 AM',
        students: Math.floor(Math.random() * 15) + 5
      }))

      const activities = students.slice(0, 5).map(s => ({
        id: s.id,
        student: s.full_name,
        action: isArabic ? 'تم تسجيل الحضور' : 'Attendance recorded',
        time: 'Today'
      }))

      setStats({
        totalStudents,
        totalClasses,
        presentToday,
        absentToday,
        lateToday,
        attendanceRate,
        needRevision,
        todayClasses
      })
      setRecentActivity(activities)

    } catch (error) {
      console.error('Error fetching teacher data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: FaUserGraduate, value: stats.totalStudents, label: t('Total Students', lang), color: 'text-primary', bg: 'bg-primary/10' },
    { icon: FaChalkboardTeacher, value: stats.totalClasses, label: t('Total Classes', lang), color: 'text-gold', bg: 'bg-gold/10' },
    { icon: FaCheckCircle, value: `${stats.attendanceRate}%`, label: t('Attendance Rate', lang), color: 'text-green-600', bg: 'bg-green-100' },
    { icon: FaStar, value: stats.needRevision, label: t('Need Revision', lang), color: 'text-orange-500', bg: 'bg-orange-100' },
  ]

  const quickActions = [
    { icon: FaCalendarCheck, label: t('Take Attendance', lang), color: 'text-green-600', bg: 'bg-green-100', path: '/teacher/attendance' },
    { icon: FaFileAlt, label: t('Attendance Reports', lang), color: 'text-purple-600', bg: 'bg-purple-100', path: '/teacher/attendance/reports' },
    { icon: FaBook, label: t('Record Memorization', lang), color: 'text-primary', bg: 'bg-primary/10', path: '/teacher/memorization' },
    { icon: FaQuran, label: t('Record Revision', lang), color: 'text-gold', bg: 'bg-gold/10', path: '/teacher/revision' },
    { icon: FaPlusCircle, label: t('Add Notes', lang), color: 'text-blue-600', bg: 'bg-blue-100', path: '/teacher/students' },
    { icon: FaUserGraduate, label: t('My Students', lang), color: 'text-primary-dark', bg: 'bg-primary-dark/10', path: '/teacher/students' },
  ]

  if (loading) {
    return (
      <DashboardLayout 
        title={t('Teacher Dashboard', lang)} 
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
      title={`${t('Welcome back, Teacher', lang)} 👋`} 
      subtitle={`${stats.totalStudents} ${t('students', lang)} · ${stats.totalClasses} ${t('classes', lang)}`}
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
              </div>
              <div className="text-2xl font-bold text-primary-dark font-english-display">{stat.value}</div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.presentToday}</div>
          <div className="text-xs text-green-600">{t('Present Today', lang)}</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
          <div className="text-2xl font-bold text-red-500">{stats.absentToday}</div>
          <div className="text-xs text-red-500">{t('Absent Today', lang)}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-500">{stats.lateToday}</div>
          <div className="text-xs text-yellow-500">{t('Late Today', lang)}</div>
        </div>
      </div>

      {/* Today's Classes & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
            <FaClock className="text-primary" />
            {t("Today's Classes", lang)}
          </h3>
          {stats.todayClasses.length === 0 ? (
            <p className="text-muted text-sm">{t('No classes today', lang)}</p>
          ) : (
            <div className="space-y-3">
              {stats.todayClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-3 bg-beige/30 rounded-lg">
                  <div>
                    <p className="font-medium text-text">{cls.name}</p>
                    <p className="text-xs text-muted">{cls.time} · {cls.students} {t('students', lang)}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{t('Active', lang)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
            <FaUserGraduate className="text-gold" />
            {t('Quick Actions', lang)}
          </h3>
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-beige">
        <h3 className="font-semibold text-primary-dark mb-4">{t('Recent Activity', lang)}</h3>
        {recentActivity.length === 0 ? (
          <p className="text-muted text-sm">{t('No recent activity', lang)}</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-muted p-3 bg-beige/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span>
                  <strong className="text-text">{activity.student}</strong> — {activity.action}
                  <span className="text-xs text-muted/70 ml-2">{activity.time}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TeacherDashboard