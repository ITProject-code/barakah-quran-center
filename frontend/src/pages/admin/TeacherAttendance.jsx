import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { t } from '../../utils/translate'
import { 
  FaCheckCircle, FaTimesCircle, FaClock, FaSave, 
  FaSync, FaSearch, FaPrint, FaDownload,
  FaChevronLeft, FaChevronRight, FaUser,
  FaCheck, FaTimes, FaUserPlus
} from 'react-icons/fa'

const AdminTeacherAttendance = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    not_recorded: 0
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchTeachers()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchAttendance()
    }
  }, [selectedDate])

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/users/role/teacher')
      setTeachers(response.data.users || [])
    } catch (error) {
      toast.error(t('Failed to fetch teachers', lang))
    }
  }

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      
      const today = new Date().toISOString().split('T')[0]
      let url = '/teacher-attendance/today'
      
      if (selectedDate !== today) {
        url = `/teacher-attendance/date/${selectedDate}`
      }
      
      const response = await api.get(url)
      
      const data = response.data.attendance || []
      
      if (data.length > 0) {
        setTeachers(data)
      } else {
        const teachersWithStatus = teachers.map(t => ({
          ...t,
          status: null
        }))
        setTeachers(teachersWithStatus)
      }
      
      const attObj = {}
      const teachersList = data.length > 0 ? data : teachers
      teachersList.forEach(t => {
        attObj[t.id] = t.status || 'not_recorded'
      })
      setAttendance(attObj)
      
      const total = teachersList.length
      const present = teachersList.filter(t => t.status === 'present').length
      const absent = teachersList.filter(t => t.status === 'absent').length
      const late = teachersList.filter(t => t.status === 'late').length
      const excused = teachersList.filter(t => t.status === 'excused').length
      const not_recorded = teachersList.filter(t => t.status === null || t.status === 'not_recorded').length
      
      setSummary({ 
        total, 
        present, 
        absent, 
        late, 
        excused, 
        not_recorded 
      })
      
    } catch (error) {
      console.error('Error fetching attendance:', error)
      toast.error(t('Failed to fetch teacher attendance', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (teacherId, status) => {
    setAttendance(prev => ({
      ...prev,
      [teacherId]: status
    }))
    
    setTeachers(prev => prev.map(t => {
      if (t.id === teacherId) {
        return { ...t, status: status === 'not_recorded' ? null : status }
      }
      return t
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const attendanceData = teachers.map(t => ({
        teacherId: t.id,
        status: attendance[t.id] || 'not_recorded',
        notes: ''
      })).filter(a => a.status !== 'not_recorded')

      if (attendanceData.length === 0) {
        toast.warning(isArabic ? 'لا توجد سجلات حضور للحفظ' : 'No attendance records to save')
        setSaving(false)
        return
      }

      await api.post('/teacher-attendance/bulk', { attendanceData })
      toast.success(t('Attendance saved successfully', lang))
      fetchAttendance()
    } catch (error) {
      console.error('Error saving:', error)
      toast.error(t('Failed to save teacher attendance', lang))
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-yellow-100 text-yellow-700',
      excused: 'bg-blue-100 text-blue-700',
      not_recorded: 'bg-gray-100 text-gray-500'
    }
    return badges[status] || 'bg-gray-100 text-gray-500'
  }

  const getStatusLabel = (status) => {
    const labels = {
      present: isArabic ? 'حاضرة' : 'Present',
      absent: isArabic ? 'غائبة' : 'Absent',
      late: isArabic ? 'متأخرة' : 'Late',
      excused: isArabic ? 'معذورة' : 'Excused',
      not_recorded: isArabic ? 'غير مسجل' : 'Not Recorded'
    }
    return labels[status] || status
  }

  const goToPreviousDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() - 1)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const goToNextDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + 1)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTeachers = teachers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(teachers.length / itemsPerPage)

  return (
    <DashboardLayout 
      title={t('Teacher Attendance', lang)} 
      subtitle={t('Record teacher attendance', lang)}
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousDay}
            className="p-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors"
          >
            <FaChevronLeft />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <button
            onClick={goToNextDay}
            className="p-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            {t('Today', lang)}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAttendance}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <FaSync /> {t('Refresh', lang)}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-primary-dark px-6 py-2 rounded-lg hover:bg-gold-light transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <FaSave /> {saving ? t('Saving...', lang) : t('Save', lang)}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-beige text-center">
          <div className="text-2xl font-bold text-primary-dark">{summary.total || 0}</div>
          <div className="text-xs text-muted">{t('Total', lang)}</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-600">{summary.present || 0}</div>
          <div className="text-xs text-green-600">{t('Present', lang)}</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
          <div className="text-2xl font-bold text-red-500">{summary.absent || 0}</div>
          <div className="text-xs text-red-500">{t('Absent', lang)}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-500">{summary.late || 0}</div>
          <div className="text-xs text-yellow-500">{t('Late', lang)}</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-500">{summary.excused || 0}</div>
          <div className="text-xs text-blue-500">{t('Excused', lang)}</div>
        </div>
      </div>

      {/* Teachers Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading...', lang)}</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaUser className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{t('No Teachers Found', lang)}</h3>
          <p className="text-muted mt-2">{t('No teachers registered in the system', lang)}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-beige overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Teacher', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Email', lang)}</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-muted uppercase">{t('Status', lang)}</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-muted uppercase">{t('Action', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {currentTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-beige/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                          {teacher.name?.charAt(0) || 'T'}
                        </div>
                        <span className="font-medium text-text">{teacher.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{teacher.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(attendance[teacher.id] || 'not_recorded')}`}>
                        {getStatusLabel(attendance[teacher.id] || 'not_recorded')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => handleStatusChange(teacher.id, 'present')}
                          className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center ${
                            attendance[teacher.id] === 'present' 
                              ? 'bg-green-500 text-white scale-110' 
                              : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500'
                          }`}
                          title={t('Present', lang)}
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={() => handleStatusChange(teacher.id, 'late')}
                          className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center ${
                            attendance[teacher.id] === 'late' 
                              ? 'bg-yellow-500 text-white scale-110' 
                              : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-500'
                          }`}
                          title={t('Late', lang)}
                        >
                          <FaClock />
                        </button>
                        <button
                          onClick={() => handleStatusChange(teacher.id, 'absent')}
                          className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center ${
                            attendance[teacher.id] === 'absent' 
                              ? 'bg-red-500 text-white scale-110' 
                              : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
                          }`}
                          title={t('Absent', lang)}
                        >
                          <FaTimesCircle />
                        </button>
                        <button
                          onClick={() => handleStatusChange(teacher.id, 'excused')}
                          className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center ${
                            attendance[teacher.id] === 'excused' 
                              ? 'bg-blue-500 text-white scale-110' 
                              : 'bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                          }`}
                          title={t('Excused', lang)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-beige">
              <p className="text-sm text-muted">
                {t('Showing', lang)} {indexOfFirstItem + 1} {t('to', lang)} {Math.min(indexOfLastItem, teachers.length)} {t('of', lang)} {teachers.length}
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
      )}
    </DashboardLayout>
  )
}

export default AdminTeacherAttendance