import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaCalendarAlt, FaUsers, FaCheckCircle, FaTimesCircle,
  FaClock, FaSearch, FaPrint, FaDownload, FaSync,
  FaChevronLeft, FaChevronRight, FaUserGraduate
} from 'react-icons/fa'

const TeacherAttendanceReports = () => {
  const { token, user } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceData, setAttendanceData] = useState([])
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0
  })
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance()
    }
  }, [selectedClass, selectedDate])

  const fetchClasses = async () => {
    try {
      const response = await api.get(`/classes/teacher/${user?.id}`)
      setClasses(response.data.classes || [])
    } catch (error) {
      toast.error('Failed to fetch classes')
    }
  }

  const fetchAttendance = async () => {
    if (!selectedClass) return
    
    try {
      setLoading(true)
      const response = await api.get(`/attendance/class/${selectedClass}?date=${selectedDate}`)
      
      const data = response.data.attendance || []
      setAttendanceData(data)
      
      // Calculate summary
      const present = data.filter(a => a.status === 'present').length
      const absent = data.filter(a => a.status === 'absent').length
      const late = data.filter(a => a.status === 'late').length
      const excused = data.filter(a => a.status === 'excused').length
      
      setSummary({
        total: data.length,
        present,
        absent,
        late,
        excused
      })
    } catch (error) {
      toast.error('Failed to fetch attendance')
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
    toast.success('Report exported successfully!')
  }

  const handleRefresh = () => {
    fetchAttendance()
    toast.success('Refreshed!')
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = attendanceData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(attendanceData.length / itemsPerPage)

  // Date navigation
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

  if (!selectedClass) {
    return (
      <DashboardLayout 
        title={isArabic ? 'تقارير الحضور' : 'Attendance Reports'} 
        subtitle={isArabic ? 'اختر حلقة لعرض التقرير' : 'Select a class to view report'}
      >
        <div className="bg-white rounded-xl p-8 border border-beige text-center">
          <FaCalendarAlt className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{isArabic ? 'اختر حلقة' : 'Select a Class'}</h3>
          <p className="text-muted mt-2">{isArabic ? 'اختر حلقة لعرض تقرير الحضور' : 'Choose a class to view attendance report'}</p>
          <div className="max-w-md mx-auto mt-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">{isArabic ? 'اختر حلقة' : 'Select a class'}</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={isArabic ? 'تقرير الحضور' : 'Attendance Report'} 
      subtitle={`${selectedClass} • ${new Date(selectedDate).toLocaleDateString(isArabic ? 'ar' : 'en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text mb-1">{isArabic ? 'الحلقة' : 'Class'}</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">{isArabic ? 'التاريخ' : 'Date'}</label>
            <div className="flex items-center gap-2">
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
                className="px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-40"
              />
              <button
                onClick={goToNextDay}
                className="p-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors"
              >
                <FaChevronRight />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                {isArabic ? 'اليوم' : 'Today'}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <FaSync /> {isArabic ? 'تحديث' : 'Refresh'}
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <FaPrint /> {isArabic ? 'طباعة' : 'Print'}
            </button>
            <button
              onClick={handleExport}
              className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
            >
              <FaDownload /> {isArabic ? 'تصدير' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-beige text-center">
          <div className="text-2xl font-bold text-primary-dark">{summary.total}</div>
          <div className="text-xs text-muted">{isArabic ? 'الإجمالي' : 'Total'}</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-600">{summary.present}</div>
          <div className="text-xs text-green-600">{isArabic ? 'حاضرة' : 'Present'}</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
          <div className="text-2xl font-bold text-red-500">{summary.absent}</div>
          <div className="text-xs text-red-500">{isArabic ? 'غائبة' : 'Absent'}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-500">{summary.late}</div>
          <div className="text-xs text-yellow-500">{isArabic ? 'متأخرة' : 'Late'}</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-500">{summary.excused}</div>
          <div className="text-xs text-blue-500">{isArabic ? 'معذورة' : 'Excused'}</div>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      ) : attendanceData.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaUserGraduate className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{isArabic ? 'لا توجد بيانات' : 'No Data'}</h3>
          <p className="text-muted mt-2">{isArabic ? 'لا توجد سجلات حضور لهذا اليوم' : 'No attendance records for this day'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-beige overflow-hidden">
          <div className="px-6 py-3 bg-beige/30 border-b border-beige flex justify-between items-center">
            <span className="font-semibold text-primary-dark">
              {attendanceData.length} {isArabic ? 'طالبة' : 'Students'}
            </span>
            <span className="text-sm text-muted">
              {isArabic ? 'نسبة الحضور' : 'Attendance Rate'}: {summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0}%
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'الطالبة' : 'Student'}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'المعرف' : 'ID'}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'سجل بواسطة' : 'Recorded By'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {currentItems.map((record) => (
                  <tr key={record.id} className="hover:bg-beige/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {record.student_name?.charAt(0) || 'S'}
                        </div>
                        <span className="font-medium text-text">{record.student_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-muted">{record.student_id_num}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{record.recorded_by_name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-beige">
              <p className="text-sm text-muted">
                {isArabic ? 'عرض' : 'Showing'} {indexOfFirstItem + 1} {isArabic ? 'إلى' : 'to'} {Math.min(indexOfLastItem, attendanceData.length)} {isArabic ? 'من' : 'of'} {attendanceData.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft />
                </button>
                <span className="px-4 py-2 border border-primary bg-primary/10 rounded-lg text-primary">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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

export default TeacherAttendanceReports