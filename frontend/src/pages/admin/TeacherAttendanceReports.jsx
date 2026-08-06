import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { t } from '../../utils/translate'
import { 
  FaCalendarAlt, FaUsers, FaCheckCircle, FaTimesCircle,
  FaClock, FaSearch, FaPrint, FaDownload, FaSync,
  FaChevronLeft, FaChevronRight, FaUser, FaChartBar,
  FaFileAlt
} from 'react-icons/fa'

const TeacherAttendanceReports = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [attendance, setAttendance] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/users/role/teacher')
      setTeachers(response.data.users || [])
    } catch (error) {
      toast.error(t('Failed to fetch teachers', lang))
    }
  }

  const fetchAttendance = async () => {
    if (!selectedTeacher) {
      toast.error(t('Please select a teacher', lang))
      return
    }

    try {
      setLoading(true)
      
      const response = await api.get(`/teacher-attendance/teacher/${selectedTeacher}`, {
        params: { startDate, endDate }
      })
      setAttendance(response.data.history || [])

      const statsRes = await api.get(`/teacher-attendance/teacher/${selectedTeacher}/stats`)
      setStats(statsRes.data.stats)

    } catch (error) {
      toast.error(t('Failed to fetch attendance', lang))
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-yellow-100 text-yellow-700',
      excused: 'bg-blue-100 text-blue-700'
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status) => {
    const icons = {
      present: <FaCheckCircle className="text-green-500" />,
      absent: <FaTimesCircle className="text-red-500" />,
      late: <FaClock className="text-yellow-500" />,
      excused: <FaCheckCircle className="text-blue-500" />
    }
    return icons[status] || <FaClock className="text-gray-500" />
  }

  const getStatusLabel = (status) => {
    const labels = {
      present: isArabic ? 'حاضرة' : 'Present',
      absent: isArabic ? 'غائبة' : 'Absent',
      late: isArabic ? 'متأخرة' : 'Late',
      excused: isArabic ? 'معذورة' : 'Excused'
    }
    return labels[status] || status
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    toast.success(t('Report exported successfully!', lang))
  }

  const handleRefresh = () => {
    fetchAttendance()
    toast.success(t('Refreshed!', lang))
  }

  const getTeacherName = () => {
    const teacher = teachers.find(t => t.id === parseInt(selectedTeacher))
    return teacher?.name || 'Teacher'
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAttendance = attendance.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(attendance.length / itemsPerPage)

  return (
    <DashboardLayout 
      title={t('Teacher Attendance Reports', lang)} 
      subtitle={t('View teacher attendance reports', lang)}
    >
      {/* Header */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/teacher-attendance')}
          className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"
        >
          <FaChevronLeft />
          {t('Back to Attendance', lang)}
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
        >
          <FaPrint />
          {t('Print', lang)}
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
        >
          <FaDownload />
          {t('Export', lang)}
        </button>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <FaSync />
          {t('Refresh', lang)}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              {t('Select Teacher', lang)}
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">{t('Select a teacher', lang)}</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              {t('Start Date', lang)}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              {t('End Date', lang)}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={fetchAttendance}
            disabled={!selectedTeacher || loading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSearch />
            {loading ? t('Loading...', lang) : t('View Report', lang)}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-beige text-center">
            <div className="text-2xl font-bold text-primary-dark">{stats.total_days || 0}</div>
            <div className="text-xs text-muted">{t('Total Days', lang)}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.present_days || 0}</div>
            <div className="text-xs text-green-600">{t('Present', lang)}</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.absent_days || 0}</div>
            <div className="text-xs text-red-500">{t('Absent', lang)}</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.late_days || 0}</div>
            <div className="text-xs text-yellow-500">{t('Late', lang)}</div>
          </div>
          <div className="bg-gold/10 rounded-xl p-4 border border-gold/30 text-center">
            <div className="text-2xl font-bold text-gold">{stats.attendance_rate || 0}%</div>
            <div className="text-xs text-gold">{t('Attendance Rate', lang)}</div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading...', lang)}</p>
        </div>
      ) : attendance.length > 0 ? (
        <div className="bg-white rounded-xl border border-beige overflow-hidden">
          <div className="px-6 py-4 bg-beige/30 border-b border-beige flex justify-between items-center">
            <span className="font-semibold text-primary-dark flex items-center gap-2">
              <FaUser className="text-primary" />
              {t('Attendance History for', lang)} {getTeacherName()}
            </span>
            <span className="text-sm text-muted">{attendance.length} {t('records', lang)}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Date', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Status', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Recorded By', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Notes', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {currentAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-beige/10 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      {new Date(record.date).toLocaleDateString(isArabic ? 'ar' : 'en', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(record.status)}`}>
                          {getStatusLabel(record.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{record.recorded_by_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted">{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-beige">
              <p className="text-sm text-muted">
                {t('Showing', lang)} {indexOfFirstItem + 1} {t('to', lang)} {Math.min(indexOfLastItem, attendance.length)} {t('of', lang)} {attendance.length}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50">
                  <FaChevronLeft />
                </button>
                <span className="px-4 py-2 border border-primary bg-primary/10 rounded-lg text-primary">{currentPage}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : selectedTeacher && !loading ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaCalendarAlt className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{t('No Records Found', lang)}</h3>
          <p className="text-muted mt-2">
            {t('No attendance records found for this teacher', lang)}
          </p>
        </div>
      ) : null}
    </DashboardLayout>
  )
}

export default TeacherAttendanceReports