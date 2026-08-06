import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaSearch, FaCalendarAlt, FaUserGraduate, 
  FaCheckCircle, FaTimesCircle, FaClock,
  FaChartLine, FaArrowLeft
} from 'react-icons/fa'

const AttendanceReports = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [attendance, setAttendance] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students')
      setStudents(response.data.students || [])
    } catch (error) {
      toast.error(t('Failed to fetch students', lang))
    }
  }

  const fetchAttendance = async () => {
    if (!selectedStudent) {
      toast.error(t('Please select a student', lang))
      return
    }

    try {
      setLoading(true)
      
      const response = await api.get(`/attendance/student/${selectedStudent}`, {
        params: { startDate, endDate }
      })
      setAttendance(response.data.attendance || [])

      const statsRes = await api.get(`/attendance/student/${selectedStudent}/stats`)
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
    return icons[status] || null
  }

  const getStudentName = () => {
    const student = students.find(s => s.id === parseInt(selectedStudent))
    return student?.full_name || 'Student'
  }

  return (
    <DashboardLayout 
      title={isArabic ? 'تقارير الحضور' : 'Attendance Reports'} 
      subtitle={isArabic ? 'عرض تاريخ حضور الطالبة' : 'View student attendance history'}
    >
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">{isArabic ? 'اختر الطالبة' : 'Select Student'}</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">{isArabic ? 'اختر طالبة' : 'Select a student'}</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.full_name} ({s.student_id})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">{isArabic ? 'تاريخ البداية' : 'Start Date'}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">{isArabic ? 'تاريخ النهاية' : 'End Date'}</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={fetchAttendance}
            disabled={!selectedStudent || loading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSearch />
            {loading ? t('Loading...', lang) : (isArabic ? 'عرض التقرير' : 'View Report')}
          </button>
          {attendance.length > 0 && (
            <button
              onClick={() => {
                setSelectedStudent('')
                setAttendance([])
                setStats(null)
              }}
              className="px-6 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"
            >
              <FaArrowLeft />
              {isArabic ? 'مسح' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-beige text-center shadow-sm">
            <div className="text-2xl font-bold text-primary-dark">{stats.total_days || 0}</div>
            <div className="text-xs text-muted mt-1">{isArabic ? 'إجمالي الأيام' : 'Total Days'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-beige text-center shadow-sm border-green-200 bg-green-50">
            <div className="text-2xl font-bold text-green-600">{stats.present_days || 0}</div>
            <div className="text-xs text-green-600 mt-1">{isArabic ? 'حاضرة' : 'Present'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-beige text-center shadow-sm border-red-200 bg-red-50">
            <div className="text-2xl font-bold text-red-500">{stats.absent_days || 0}</div>
            <div className="text-xs text-red-500 mt-1">{isArabic ? 'غائبة' : 'Absent'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-beige text-center shadow-sm border-yellow-200 bg-yellow-50">
            <div className="text-2xl font-bold text-yellow-500">{stats.late_days || 0}</div>
            <div className="text-xs text-yellow-500 mt-1">{isArabic ? 'متأخرة' : 'Late'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-beige text-center shadow-sm border-gold/30 bg-gold/10">
            <div className="text-2xl font-bold text-gold">{stats.attendance_rate || 0}%</div>
            <div className="text-xs text-gold mt-1">{isArabic ? 'نسبة الحضور' : 'Attendance Rate'}</div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading attendance...', lang)}</p>
        </div>
      ) : attendance.length > 0 ? (
        <div className="bg-white rounded-xl border border-beige overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-primary/5 border-b border-beige flex justify-between items-center">
            <span className="font-semibold text-primary-dark flex items-center gap-2">
              <FaUserGraduate className="text-primary" />
              {isArabic ? 'سجل حضور' : 'Attendance History for'} {getStudentName()}
            </span>
            <span className="text-sm text-muted">{attendance.length} {isArabic ? 'سجل' : 'records'}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'التاريخ' : 'Date'}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'الحلقة' : 'Class'}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'سجل بواسطة' : 'Recorded By'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {attendance.map((record) => (
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
                          {isArabic ? (
                            record.status === 'present' ? 'حاضرة' :
                            record.status === 'absent' ? 'غائبة' :
                            record.status === 'late' ? 'متأخرة' :
                            record.status === 'excused' ? 'معذورة' :
                            record.status
                          ) : record.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{record.class_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted">{record.recorded_by_name || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedStudent && !loading ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaCalendarAlt className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{isArabic ? 'لا توجد سجلات حضور' : 'No Attendance Records'}</h3>
          <p className="text-muted mt-2">{isArabic ? 'لا توجد سجلات حضور لهذه الطالبة في الفترة المحددة' : 'No attendance found for this student in the selected date range'}</p>
        </div>
      ) : null}
    </DashboardLayout>
  )
}

export default AttendanceReports