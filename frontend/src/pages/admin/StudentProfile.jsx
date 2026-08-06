import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaUser, FaPhone, FaBook, FaChalkboardTeacher, 
  FaCalendar, FaArrowLeft, FaEdit, FaTrash,
  FaUserGraduate, FaIdCard
} from 'react-icons/fa'

const StudentProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchStudent()
  }, [id])

  const fetchStudent = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/students/${id}`)
      setStudent(response.data.student)
    } catch (error) {
      toast.error(t('Failed to fetch student details', lang))
      navigate('/admin/students')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/students/${id}`)
      toast.success(t('Student deleted successfully', lang))
      navigate('/admin/students')
    } catch (error) {
      toast.error(t('Failed to delete student', lang))
    }
  }

  if (loading) {
    return (
      <DashboardLayout title={t('Student Profile', lang)} subtitle={t('Loading...', lang)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">{t('Loading student details...', lang)}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!student) {
    return (
      <DashboardLayout title={t('Student Profile', lang)} subtitle={t('Student not found', lang)}>
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <p className="text-muted">{t('Student not found', lang)}</p>
          <button onClick={() => navigate('/admin/students')} className="mt-4 text-primary hover:underline">{t('Back to Students', lang)}</button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={student.full_name} 
      subtitle={`${t('Student ID', lang)}: ${student.student_id}`}
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => navigate('/admin/students')} className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"><FaArrowLeft /> {t('Back', lang)}</button>
        <button onClick={() => navigate(`/admin/students/edit/${student.id}`)} className="px-4 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors flex items-center gap-2"><FaEdit /> {t('Edit', lang)}</button>
        <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"><FaTrash /> {t('Delete', lang)}</button>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2"><FaUser className="text-primary" /> {t('Personal Information', lang)}</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-muted">{t('Full Name', lang)}</label><p className="font-medium text-text">{student.full_name}</p></div>
            {student.arabic_name && <div><label className="text-xs text-muted">{t('Arabic Name', lang)}</label><p className="font-medium text-text font-arabic">{student.arabic_name}</p></div>}
            <div><label className="text-xs text-muted">{t('Student ID', lang)}</label><p className="font-medium text-text font-mono">{student.student_id}</p></div>
            <div>
              <label className="text-xs text-muted">{t('Status', lang)}</label>
              <span className={`text-xs px-3 py-1 rounded-full inline-block ${
                student.status === 'active' ? 'bg-green-100 text-green-700' :
                student.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                student.status === 'graduated' ? 'bg-gold/20 text-gold' :
                'bg-gray-100 text-gray-700'
              }`}>
                {isArabic ? (
                  student.status === 'active' ? 'نشطة' :
                  student.status === 'inactive' ? 'غير نشطة' :
                  student.status === 'graduated' ? 'خريجة' :
                  student.status || 'نشطة'
                ) : student.status || 'Active'}
              </span>
            </div>
            <div><label className="text-xs text-muted">{t('Enrollment Date', lang)}</label><p className="font-medium text-text">{new Date(student.enrollment_date).toLocaleDateString()}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2"><FaUserGraduate className="text-primary" /> {t('Guardian & Class Information', lang)}</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-muted">{t('Guardian Name', lang)}</label><p className="font-medium text-text">{student.guardian_name || '-'}</p></div>
            <div><label className="text-xs text-muted">{t('Guardian Phone', lang)}</label><p className="font-medium text-text">{student.guardian_phone || '-'}</p></div>
            <div><label className="text-xs text-muted">{t('Class', lang)}</label><p className="font-medium text-text">{student.class_name || t('Not Assigned', lang)}</p></div>
            <div><label className="text-xs text-muted">{t('Assigned Teacher', lang)}</label><p className="font-medium text-text">{student.teacher_name || t('Not Assigned', lang)}</p></div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><FaTrash className="text-2xl text-red-500" /></div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">{t('Delete Student', lang)}</h3>
              <p className="text-muted">{t('Are you sure you want to delete', lang)} <strong>{student.full_name}</strong>?<br />{t('This action cannot be undone', lang)}</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors">{t('Cancel', lang)}</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">{t('Delete', lang)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default StudentProfile