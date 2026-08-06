import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaUser, FaEnvelope, FaPhone, FaUserTag, 
  FaCalendar, FaArrowLeft, FaEdit, FaTrash,
  FaChalkboardTeacher, FaBook, FaUsers,
  FaUserGraduate, FaChartLine, FaKey, FaSave, FaTimes
} from 'react-icons/fa'

const TeacherProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const { lang, isArabic } = useLanguage()
  const [teacher, setTeacher] = useState(null)
  const [stats, setStats] = useState({
    assignedClasses: 0,
    totalStudents: 0,
    attendanceRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'teacher',
    password: ''
  })

  useEffect(() => {
    fetchTeacherData()
  }, [id])

  const fetchTeacherData = async () => {
    try {
      setLoading(true)
      
      const teacherRes = await api.get(`/users/${id}`)
      setTeacher(teacherRes.data.user)

      const classesRes = await api.get(`/classes/teacher/${id}`)
      const classes = classesRes.data.classes || []
      const assignedClasses = classes.length

      const studentsRes = await api.get(`/students/teacher/${id}`)
      const students = studentsRes.data.students || []
      const totalStudents = students.length

      let attendanceStats = {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        attendanceRate: 0
      }

      try {
        const statsRes = await api.get(`/attendance/teacher/${id}/stats`)
        attendanceStats = statsRes.data.stats || attendanceStats
      } catch (error) {
        console.log('No attendance stats yet')
      }

      setStats({
        assignedClasses,
        totalStudents,
        attendanceRate: attendanceStats.attendanceRate || 0
      })

    } catch (error) {
      console.error('Error fetching teacher data:', error)
      toast.error(t('Failed to fetch teacher details', lang))
      navigate('/admin/teachers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${id}`)
      toast.success(t('Teacher deleted successfully', lang))
      navigate('/admin/teachers')
    } catch (error) {
      toast.error(t('Failed to delete teacher', lang))
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await api.put(`/users/${id}`, {
        name: formData.name,
        phone: formData.phone,
        role: formData.role
      })
      
      if (formData.password && formData.password.length >= 6) {
        await api.post('/auth/admin-reset-password', {
          userId: id,
          newPassword: formData.password
        })
        toast.success(`Password reset successfully for ${formData.name}`)
      } else if (formData.password && formData.password.length < 6) {
        toast.warning(isArabic ? 'كلمة المرور غير محدثة (6 أحرف على الأقل)' : 'Password not updated (minimum 6 characters required)')
      }
      
      toast.success(t('Teacher updated successfully', lang))
      setShowEditModal(false)
      fetchTeacherData()
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to update teacher', lang))
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = () => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        phone: teacher.phone || '',
        role: teacher.role,
        password: ''
      })
      setShowEditModal(true)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title={t('Teacher Profile', lang)} subtitle={t('Loading...', lang)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">{t('Loading...', lang)}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!teacher) {
    return (
      <DashboardLayout title={t('Teacher Profile', lang)} subtitle={t('Teacher not found', lang)}>
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <p className="text-muted">{t('Teacher not found', lang)}</p>
          <button onClick={() => navigate('/admin/teachers')} className="mt-4 text-primary hover:underline">{t('Back to Teachers', lang)}</button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={teacher.name} 
      subtitle={`${t('Teacher Profile', lang)} • ${teacher.role}`}
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => navigate('/admin/teachers')} className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"><FaArrowLeft /> {t('Back', lang)}</button>
        <button onClick={openEditModal} className="px-4 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors flex items-center gap-2"><FaEdit /> {t('Edit', lang)}</button>
        <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"><FaTrash /> {t('Delete', lang)}</button>
      </div>

      {/* Teacher Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2"><FaUser className="text-primary" /> {t('Personal Information', lang)}</h3>
          <div className="space-y-4">
            <div><label className="text-xs text-muted">{t('Full Name', lang)}</label><p className="font-medium text-text text-lg">{teacher.name}</p></div>
            <div><label className="text-xs text-muted">{t('Email', lang)}</label><p className="font-medium text-text flex items-center gap-2"><FaEnvelope className="text-primary text-sm" /> {teacher.email}</p></div>
            {teacher.phone && <div><label className="text-xs text-muted">{t('Phone', lang)}</label><p className="font-medium text-text flex items-center gap-2"><FaPhone className="text-primary text-sm" /> {teacher.phone}</p></div>}
            <div><label className="text-xs text-muted">{t('Teacher ID', lang)}</label><p className="font-medium text-text font-mono flex items-center gap-2"><FaUserTag className="text-primary text-sm" /> #{teacher.id}</p></div>
            <div><label className="text-xs text-muted">{t('Role', lang)}</label><p className="font-medium text-text"><span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm">{teacher.role}</span></p></div>
            <div><label className="text-xs text-muted">{t('Joined', lang)}</label><p className="font-medium text-text flex items-center gap-2"><FaCalendar className="text-primary text-sm" /> {new Date(teacher.created_at).toLocaleDateString()}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2"><FaChalkboardTeacher className="text-gold" /> {t('Teaching Information', lang)}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-primary-dark">{stats.assignedClasses}</div><div className="text-xs text-muted">{t('Assigned Classes', lang)}</div></div>
              <div className="bg-gold/5 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-gold">{stats.totalStudents}</div><div className="text-xs text-muted">{t('Total Students', lang)}</div></div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-green-600">{stats.attendanceRate}%</div><div className="text-xs text-green-600">{t('Attendance Rate', lang)}</div></div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-primary-dark mb-4">{t('Edit Teacher', lang)}</h3>
            <p className="text-sm text-muted mb-4">{isArabic ? 'تحديث معلومات المعلمة. اترك كلمة المرور فارغة للحفاظ على كلمة المرور الحالية.' : 'Update teacher information. Leave password empty to keep current password.'}</p>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-text mb-1">{t('Full Name', lang)} *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-text mb-1">{t('Phone', lang)}</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-text mb-1">{t('Role', lang)}</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"><option value="teacher">{t('Teacher', lang)}</option><option value="admin">{t('Admin', lang)}</option></select></div>
              <div className="border-t border-beige pt-4">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-medium text-yellow-700 mb-2 flex items-center gap-2"><FaKey className="text-yellow-500" /> {t('Reset Password', lang)}</h4>
                  <p className="text-xs text-yellow-600 mb-2">{isArabic ? 'أدخل كلمة مرور جديدة لإعادة تعيين كلمة مرور المعلمة.' : 'Enter a new password to reset the teacher\'s password.'}</p>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={isArabic ? 'أدخل كلمة مرور جديدة (6 أحرف على الأقل)' : 'Enter new password (min 6 characters)'} className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"><FaSave /> {saving ? t('Saving...', lang) : t('Update Teacher', lang)}</button>
                <button type="button" onClick={() => { setShowEditModal(false); setFormData({ name: '', phone: '', role: 'teacher', password: '' }) }} className="flex-1 bg-gray-100 text-text py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"><FaTimes /> {t('Cancel', lang)}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><FaTrash className="text-2xl text-red-500" /></div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">{t('Delete Teacher', lang)}</h3>
              <p className="text-muted">{t('Are you sure you want to delete', lang)} <strong>{teacher.name}</strong>?<br />{t('This action cannot be undone', lang)}</p>
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

export default TeacherProfile