import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaChalkboardTeacher, FaUsers, FaBook } from 'react-icons/fa'

const TeacherProfile = () => {
  const { token, user } = useAuth()
  const { lang, isArabic } = useLanguage()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    attendanceRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeacherStats()
  }, [])

  const fetchTeacherStats = async () => {
    try {
      setLoading(true)
      const studentsRes = await api.get(`/students/teacher/${user?.id}`)
      const classesRes = await api.get(`/classes/teacher/${user?.id}`)
      setStats({
        totalStudents: studentsRes.data.students?.length || 0,
        totalClasses: classesRes.data.classes?.length || 0,
        attendanceRate: 92 // Placeholder
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title={t('My Profile', lang)} subtitle={t('Personal and teaching information', lang)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2"><FaUser className="text-primary" /> {t('Personal Information', lang)}</h3>
          <div className="space-y-4">
            <div><label className="text-xs text-muted">{t('Full Name', lang)}</label><p className="font-medium text-text text-lg">{user?.name}</p></div>
            <div><label className="text-xs text-muted">{t('Email', lang)}</label><p className="font-medium text-text flex items-center gap-2"><FaEnvelope className="text-primary text-sm" /> {user?.email}</p></div>
            <div><label className="text-xs text-muted">{t('Phone', lang)}</label><p className="font-medium text-text flex items-center gap-2"><FaPhone className="text-primary text-sm" /> {user?.phone || '-'}</p></div>
            <div><label className="text-xs text-muted">{t('Role', lang)}</label><p className="font-medium text-text"><span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm">{isArabic ? 'معلمة' : 'Teacher'}</span></p></div>
            <div><label className="text-xs text-muted">{t('Joined', lang)}</label><p className="font-medium text-text flex items-center gap-2"><FaCalendar className="text-primary text-sm" /> {new Date(user?.created_at).toLocaleDateString()}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2"><FaChalkboardTeacher className="text-gold" /> {t('Teaching Information', lang)}</h3>
          <div className="space-y-4">
            <div className="bg-primary/5 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-primary-dark">{stats.totalClasses}</div><div className="text-xs text-muted">{t('Classes Assigned', lang)}</div></div>
            <div className="bg-gold/5 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-gold">{stats.totalStudents}</div><div className="text-xs text-muted">{t('Students Assigned', lang)}</div></div>
            <div className="bg-green-50 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-green-600">{stats.attendanceRate}%</div><div className="text-xs text-muted">{t('Attendance Rate', lang)}</div></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TeacherProfile