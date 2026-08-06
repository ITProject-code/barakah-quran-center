import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaUser, FaArrowLeft, FaCalendar, FaPhone, FaUserTag,
  FaCheckCircle, FaTimesCircle, FaClock, FaBook, FaQuran,
  FaChartLine, FaCalendarAlt
} from 'react-icons/fa'

const TeacherStudentProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const [student, setStudent] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentData()
  }, [id])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      
      // Fetch student details
      const studentRes = await api.get(`/students/${id}`)
      setStudent(studentRes.data.student)

      // Fetch student attendance
      const attendanceRes = await api.get(`/attendance/student/${id}`)
      setAttendance(attendanceRes.data.attendance || [])

      // Fetch student stats
      const statsRes = await api.get(`/attendance/student/${id}/stats`)
      setStats(statsRes.data.stats)

    } catch (error) {
      toast.error('Failed to fetch student data')
      navigate('/teacher/students')
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

  if (loading) {
    return (
      <DashboardLayout title="Student Profile" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!student) {
    return (
      <DashboardLayout title="Student Profile" subtitle="Not found">
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <p className="text-muted">Student not found</p>
          <button onClick={() => navigate('/teacher/students')} className="mt-4 text-primary hover:underline">
            Back to Students
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={student.full_name} 
      subtitle={`Student ID: ${student.student_id}`}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/teacher/students')}
        className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-6"
      >
        <FaArrowLeft /> {isArabic ? 'رجوع إلى الطالبات' : 'Back to Students'}
      </button>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-beige text-center">
          <div className="text-2xl font-bold text-primary-dark">{stats?.total_days || 0}</div>
          <div className="text-xs text-muted">{isArabic ? 'إجمالي الأيام' : 'Total Days'}</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats?.present_days || 0}</div>
          <div className="text-xs text-green-600">{isArabic ? 'حاضرة' : 'Present'}</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
          <div className="text-2xl font-bold text-red-500">{stats?.absent_days || 0}</div>
          <div className="text-xs text-red-500">{isArabic ? 'غائبة' : 'Absent'}</div>
        </div>
        <div className="bg-gold/10 rounded-xl p-4 border border-gold/30 text-center">
          <div className="text-2xl font-bold text-gold">{stats?.attendance_rate || 0}%</div>
          <div className="text-xs text-gold">{isArabic ? 'نسبة الحضور' : 'Attendance Rate'}</div>
        </div>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
            <FaUser className="text-primary" />
            {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}
          </h3>
          <div className="space-y-3">
            <div><label className="text-xs text-muted">{isArabic ? 'الاسم الكامل' : 'Full Name'}</label><p className="font-medium">{student.full_name}</p></div>
            {student.arabic_name && <div><label className="text-xs text-muted">{isArabic ? 'الاسم بالعربية' : 'Arabic Name'}</label><p className="font-medium font-arabic">{student.arabic_name}</p></div>}
            <div><label className="text-xs text-muted">{isArabic ? 'معرف الطالبة' : 'Student ID'}</label><p className="font-medium font-mono">{student.student_id}</p></div>
            <div><label className="text-xs text-muted">{isArabic ? 'الحالة' : 'Status'}</label>
              <span className={`text-xs px-3 py-1 rounded-full ${
                student.status === 'active' ? 'bg-green-100 text-green-700' :
                student.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {isArabic ? (student.status === 'active' ? 'نشطة' : student.status) : student.status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
            <FaUserTag className="text-gold" />
            {isArabic ? 'معلومات ولي الأمر' : 'Guardian Information'}
          </h3>
          <div className="space-y-3">
            <div><label className="text-xs text-muted">{isArabic ? 'اسم ولي الأمر' : 'Guardian Name'}</label><p className="font-medium">{student.guardian_name || '-'}</p></div>
            <div><label className="text-xs text-muted">{isArabic ? 'هاتف ولي الأمر' : 'Guardian Phone'}</label><p className="font-medium">{student.guardian_phone || '-'}</p></div>
            <div><label className="text-xs text-muted">{isArabic ? 'الحلقة' : 'Class'}</label><p className="font-medium">{student.class_name || '-'}</p></div>
            <div><label className="text-xs text-muted">{isArabic ? 'المعلمة' : 'Teacher'}</label><p className="font-medium">{student.teacher_name || '-'}</p></div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-xl border border-beige overflow-hidden">
        <div className="px-6 py-4 bg-beige/30 border-b border-beige">
          <h3 className="font-semibold text-primary-dark flex items-center gap-2">
            <FaCalendarAlt className="text-primary" />
            {isArabic ? 'سجل الحضور' : 'Attendance History'}
          </h3>
        </div>
        {attendance.length === 0 ? (
          <div className="p-8 text-center text-muted">{isArabic ? 'لا توجد سجلات حضور' : 'No attendance records'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/20">
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
                    <td className="px-6 py-4 text-sm text-muted">{record.recorded_by_name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TeacherStudentProfile