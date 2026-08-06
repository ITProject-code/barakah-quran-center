import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaArrowLeft, FaUsers, FaChalkboardTeacher, FaBook, 
  FaEdit, FaTrash, FaUserGraduate, FaCalendar,
  FaSave, FaTimes, FaUser, FaPhone, FaUserTag,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa'

const ClassDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const [classData, setClassData] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'beginner',
    teacher_id: '',
    max_students: 20,
    status: 'active'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchClassDetails()
  }, [id])

  const fetchClassDetails = async () => {
    try {
      setLoading(true)
      
      const classRes = await api.get(`/classes/${id}`)
      setClassData(classRes.data.class)

      const studentsRes = await api.get(`/classes/${id}/students`)
      setStudents(studentsRes.data.students || [])
    } catch (error) {
      toast.error(t('Failed to fetch class details', lang))
      navigate('/admin/classes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/classes/${id}`)
      toast.success(t('Class deleted successfully', lang))
      navigate('/admin/classes')
    } catch (error) {
      toast.error(t('Failed to delete class', lang))
    }
  }

  const openEditModal = () => {
    if (classData) {
      setFormData({
        name: classData.name,
        description: classData.description || '',
        level: classData.level || 'beginner',
        teacher_id: classData.teacher_id || '',
        max_students: classData.max_students || 20,
        status: classData.status || 'active'
      })
      setShowEditModal(true)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await api.put(`/classes/${id}`, formData)
      toast.success(t('Class updated successfully', lang))
      setShowEditModal(false)
      fetchClassDetails()
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to update class', lang))
    } finally {
      setSaving(false)
    }
  }

  const getLevelBadge = (level) => {
    const levels = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-gold/20 text-gold',
      expert: 'bg-purple-100 text-purple-700'
    }
    return levels[level] || 'bg-gray-100 text-gray-700'
  }

  const getStatusBadge = (status) => {
    const statuses = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      completed: 'bg-blue-100 text-blue-700'
    }
    return statuses[status] || 'bg-gray-100 text-gray-700'
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(students.length / itemsPerPage)

  if (loading) {
    return (
      <DashboardLayout title={isArabic ? 'تفاصيل الحلقة' : 'Class Details'} subtitle={isArabic ? 'جاري التحميل...' : 'Loading...'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">{t('Loading...', lang)}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!classData) {
    return (
      <DashboardLayout title={isArabic ? 'تفاصيل الحلقة' : 'Class Details'} subtitle={isArabic ? 'الحلقة غير موجودة' : 'Class not found'}>
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <p className="text-muted">{isArabic ? 'الحلقة غير موجودة' : 'Class not found'}</p>
          <button onClick={() => navigate('/admin/classes')} className="mt-4 text-primary hover:underline">
            {isArabic ? 'رجوع إلى الحلقات' : 'Back to Classes'}
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={classData.name} 
      subtitle={`${isArabic ? 'تفاصيل الحلقة' : 'Class Details'} • ${classData.student_count || 0} ${isArabic ? 'طالبة' : 'students'}`}
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => navigate('/admin/classes')} className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"><FaArrowLeft /> {isArabic ? 'رجوع' : 'Back'}</button>
        <button onClick={openEditModal} className="px-4 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors flex items-center gap-2"><FaEdit /> {isArabic ? 'تعديل' : 'Edit'}</button>
        <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"><FaTrash /> {isArabic ? 'حذف' : 'Delete'}</button>
      </div>

      {/* Class Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-beige">
          <div className="flex items-center gap-3 mb-2"><FaBook className="text-2xl text-primary" /><div><div className="text-xs text-muted">{isArabic ? 'المستوى' : 'Level'}</div><span className={`text-sm font-semibold px-2 py-1 rounded-full ${getLevelBadge(classData.level)}`}>{isArabic ? (classData.level === 'beginner' ? 'مبتدئ' : classData.level === 'intermediate' ? 'متوسط' : classData.level === 'advanced' ? 'متقدم' : classData.level === 'expert' ? 'خبير' : classData.level || 'مبتدئ') : classData.level || 'Beginner'}</span></div></div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-beige">
          <div className="flex items-center gap-3 mb-2"><FaUsers className="text-2xl text-primary" /><div><div className="text-xs text-muted">{isArabic ? 'الطالبات' : 'Students'}</div><div className="text-lg font-bold text-primary-dark">{classData.student_count || 0} / {classData.max_students || 100}</div></div></div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-beige">
          <div className="flex items-center gap-3 mb-2"><FaChalkboardTeacher className="text-2xl text-gold" /><div><div className="text-xs text-muted">{isArabic ? 'المعلمة' : 'Teacher'}</div><div className="text-sm font-medium text-text">{classData.teacher_name || (isArabic ? 'غير معين' : 'Not Assigned')}</div></div></div>
        </div>
      </div>

      {classData.description && (
        <div className="bg-white rounded-xl p-6 border border-beige mb-6">
          <h3 className="font-semibold text-primary-dark mb-2">{isArabic ? 'الوصف' : 'Description'}</h3>
          <p className="text-muted">{classData.description}</p>
        </div>
      )}

      {/* Students in Class */}
      <div className="bg-white rounded-xl border border-beige overflow-hidden">
        <div className="px-6 py-4 bg-beige/30 border-b border-beige flex justify-between items-center">
          <h3 className="font-semibold text-primary-dark flex items-center gap-2"><FaUserGraduate /> {isArabic ? 'الطالبات في هذه الحلقة' : 'Students in this Class'} ({students.length})</h3>
        </div>
        {students.length === 0 ? (
          <div className="p-8 text-center text-muted">{isArabic ? 'لا توجد طالبات في هذه الحلقة' : 'No students assigned to this class yet'}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-beige/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'الطالبة' : 'Student'}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'المعرف' : 'ID'}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'ولي الأمر' : 'Guardian'}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{isArabic ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-beige/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {student.full_name?.charAt(0) || 'S'}
                          </div>
                          <span className="font-medium text-text">{student.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-muted">{student.student_id}</td>
                      <td className="px-6 py-4 text-sm text-muted">{student.guardian_name || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          student.status === 'active' ? 'bg-green-100 text-green-700' :
                          student.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {isArabic ? (student.status === 'active' ? 'نشطة' : student.status === 'inactive' ? 'غير نشطة' : student.status || 'نشطة') : student.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-beige">
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
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-primary-dark mb-4">{isArabic ? 'تعديل الحلقة' : 'Edit Class'}</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-text mb-1">{isArabic ? 'اسم الحلقة' : 'Class Name'} *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-text mb-1">{isArabic ? 'الوصف' : 'Description'}</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-text mb-1">{isArabic ? 'المستوى' : 'Level'}</label><select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"><option value="beginner">{isArabic ? 'مبتدئ' : 'Beginner'}</option><option value="intermediate">{isArabic ? 'متوسط' : 'Intermediate'}</option><option value="advanced">{isArabic ? 'متقدم' : 'Advanced'}</option><option value="expert">{isArabic ? 'خبير' : 'Expert'}</option></select></div>
                <div><label className="block text-sm font-medium text-text mb-1">{isArabic ? 'الحد الأقصى' : 'Max Students'}</label><input type="number" value={formData.max_students} onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 20 })} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" min="1" max="100" /></div>
              </div>
              <div><label className="block text-sm font-medium text-text mb-1">{isArabic ? 'المعلمة المسؤولة' : 'Assigned Teacher'}</label><select value={formData.teacher_id} onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"><option value="">{isArabic ? 'اختر المعلمة' : 'Select Teacher'}</option></select></div>
              <div><label className="block text-sm font-medium text-text mb-1">{isArabic ? 'الحالة' : 'Status'}</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"><option value="active">{isArabic ? 'نشطة' : 'Active'}</option><option value="inactive">{isArabic ? 'غير نشطة' : 'Inactive'}</option><option value="completed">{isArabic ? 'مكتملة' : 'Completed'}</option></select></div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"><FaSave /> {saving ? t('Saving...', lang) : (isArabic ? 'تحديث' : 'Update')}</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-100 text-text py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"><FaTimes /> {isArabic ? 'إلغاء' : 'Cancel'}</button>
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
              <h3 className="text-xl font-bold text-primary-dark mb-2">{isArabic ? 'حذف الحلقة' : 'Delete Class'}</h3>
              <p className="text-muted">{isArabic ? 'هل أنت متأكد أنك تريد حذف' : 'Are you sure you want to delete'} <strong>{classData.name}</strong>?<br />{isArabic ? 'هذا الإجراء لا يمكن التراجع عنه.' : 'This action cannot be undone.'}</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors">{isArabic ? 'إلغاء' : 'Cancel'}</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">{isArabic ? 'حذف' : 'Delete'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ClassDetails