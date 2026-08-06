import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaCalendarCheck, FaCheckCircle, FaTimesCircle, FaClock,
  FaSave, FaSync, FaUserGraduate, FaChevronLeft, FaChevronRight,
  FaFileAlt, FaArrowRight, FaCheck
} from 'react-icons/fa'

const TeacherAttendance = () => {
  const { token, user } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchTodayAttendance()
    }
  }, [selectedClass, date])

  const fetchClasses = async () => {
    try {
      const response = await api.get(`/classes/teacher/${user?.id}`)
      setClasses(response.data.classes || [])
    } catch (error) {
      toast.error(t('Failed to fetch', lang))
    }
  }

  const fetchTodayAttendance = async () => {
    if (!selectedClass) return
    try {
      setLoading(true)
      const response = await api.get(`/attendance/class/${selectedClass}/today`)
      const studentsData = response.data.attendance || []
      setStudents(studentsData)
      const attObj = {}
      studentsData.forEach(s => { attObj[s.id] = s.status || 'present' })
      setAttendance(attObj)
    } catch (error) {
      toast.error(t('Failed to fetch', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    if (!selectedClass) { toast.error(t('Please select a class', lang)); return }
    setSaving(true)
    try {
      const attendanceData = students.map(s => ({
        studentId: s.id,
        classId: parseInt(selectedClass),
        status: attendance[s.id] || 'present',
        notes: ''
      }))
      await api.post('/attendance/bulk', { attendanceData })
      toast.success(t('Attendance saved successfully', lang))
      await fetchTodayAttendance()
    } catch (error) {
      toast.error(t('Failed to save', lang))
    } finally {
      setSaving(false)
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

  // Get status counts
  const statusCounts = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    late: Object.values(attendance).filter(s => s === 'late').length,
    excused: Object.values(attendance).filter(s => s === 'excused').length
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(students.length / itemsPerPage)

  if (!selectedClass) {
    return (
      <DashboardLayout title={isArabic ? 'تسجيل الحضور' : 'Take Attendance'} subtitle={isArabic ? 'اختر حلقة لتسجيل الحضور' : 'Select a class to mark attendance'}>
        <div className="bg-white rounded-xl p-8 border border-beige text-center">
          <FaCalendarCheck className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{isArabic ? 'اختر حلقة' : 'Select a Class'}</h3>
          <p className="text-muted mt-2">{isArabic ? 'اختر حلقة لتسجيل الحضور' : 'Choose a class to mark attendance'}</p>
          <div className="max-w-md mx-auto mt-4">
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="">{isArabic ? 'اختر حلقة' : 'Select a class'}</option>
              {classes.map((cls) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={isArabic ? 'تسجيل الحضور' : 'Take Attendance'} subtitle={`${students.length} ${isArabic ? 'طالبة في الحلقة' : 'students in class'}`}>
      {/* Reports Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/teacher/attendance/reports')}
          className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
        >
          <FaFileAlt />
          {isArabic ? 'تقارير الحضور' : 'Attendance Reports'}
          <FaArrowRight className="text-sm" />
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text mb-1">{isArabic ? 'الحلقة' : 'Class'}</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              {classes.map((cls) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">{isArabic ? 'التاريخ' : 'Date'}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={fetchTodayAttendance} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"><FaSync /> {isArabic ? 'تحديث' : 'Refresh'}</button>
            <button onClick={handleSave} disabled={saving} className="bg-gold text-primary-dark px-6 py-2 rounded-lg hover:bg-gold-light transition-colors flex items-center gap-2 disabled:opacity-50"><FaSave /> {saving ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ' : 'Save')}</button>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
          <div className="text-2xl font-bold text-green-600">{statusCounts.present}</div>
          <div className="text-xs text-green-600">{isArabic ? 'حاضرة' : 'Present'}</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
          <div className="text-2xl font-bold text-red-600">{statusCounts.absent}</div>
          <div className="text-xs text-red-600">{isArabic ? 'غائبة' : 'Absent'}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.late}</div>
          <div className="text-xs text-yellow-600">{isArabic ? 'متأخرة' : 'Late'}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.excused}</div>
          <div className="text-xs text-blue-600">{isArabic ? 'معذورة' : 'Excused'}</div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-muted mt-4">{isArabic ? 'جاري التحميل...' : 'Loading...'}</p></div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaUserGraduate className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{isArabic ? 'لا توجد طالبات' : 'No Students Found'}</h3>
          <p className="text-muted mt-2">{isArabic ? 'لا توجد طالبات نشطات في هذه الحلقة' : 'No active students in this class'}</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-beige overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-beige/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'الطالبة' : 'Student'}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'المعرف' : 'ID'}</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted uppercase">{isArabic ? 'الحالة' : 'Status'}</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted uppercase">{isArabic ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-beige/10 transition-colors">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{student.full_name?.charAt(0) || 'S'}</div><span className="font-medium">{student.full_name}</span></div></td>
                      <td className="px-6 py-4 text-sm font-mono text-muted">{student.student_id}</td>
                      <td className="px-6 py-4 text-center"><span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(attendance[student.id] || 'present')}`}>{attendance[student.id] || 'present'}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1.5">
                          <button onClick={() => handleStatusChange(student.id, 'present')} className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center ${attendance[student.id] === 'present' ? 'bg-green-500 text-white scale-110' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500'}`} title={isArabic ? 'حاضرة' : 'Present'}><FaCheckCircle /></button>
                          <button onClick={() => handleStatusChange(student.id, 'late')} className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center ${attendance[student.id] === 'late' ? 'bg-yellow-500 text-white scale-110' : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-500'}`} title={isArabic ? 'متأخرة' : 'Late'}><FaClock /></button>
                          <button onClick={() => handleStatusChange(student.id, 'absent')} className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center ${attendance[student.id] === 'absent' ? 'bg-red-500 text-white scale-110' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'}`} title={isArabic ? 'غائبة' : 'Absent'}><FaTimesCircle /></button>
                          {/* EXCUSED BUTTON ADDED HERE */}
                          <button onClick={() => handleStatusChange(student.id, 'excused')} className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center ${attendance[student.id] === 'excused' ? 'bg-blue-500 text-white scale-110' : 'bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-500'}`} title={isArabic ? 'معذورة' : 'Excused'}><FaCheck /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted">{isArabic ? 'عرض' : 'Showing'} {indexOfFirstItem + 1} {isArabic ? 'إلى' : 'to'} {Math.min(indexOfLastItem, students.length)} {isArabic ? 'من' : 'of'} {students.length}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronLeft /></button>
                <span className="px-4 py-2 border border-primary bg-primary/10 rounded-lg text-primary">{currentPage}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronRight /></button>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default TeacherAttendance