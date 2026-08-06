import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaUserPlus, FaEdit, FaTrash, FaEye, FaUser, 
  FaChalkboardTeacher, FaSearch, FaChevronLeft, FaChevronRight,
  FaPhone, FaEnvelope, FaUserTag, FaKey, FaSave, FaTimes
} from 'react-icons/fa'

const Teachers = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'teacher',
    password: ''
  })
  const [saving, setSaving] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users/role/teacher')
      setTeachers(response.data.users || [])
    } catch (error) {
      toast.error(t('Failed to fetch teachers', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchTeachers()
      return
    }
    try {
      setLoading(true)
      const response = await api.get('/users')
      const allUsers = response.data.users || []
      const filtered = allUsers.filter(user => 
        user.role === 'teacher' &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.phone?.includes(searchTerm))
      )
      setTeachers(filtered)
    } catch (error) {
      toast.error(t('Search failed', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${selectedTeacher.id}`)
      toast.success(t('Teacher deleted successfully', lang))
      setShowDeleteModal(false)
      fetchTeachers()
    } catch (error) {
      toast.error(t('Failed to delete teacher', lang))
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await api.put(`/users/${editingTeacher.id}`, {
        name: formData.name,
        phone: formData.phone,
        role: formData.role
      })
      
      if (formData.password && formData.password.length >= 6) {
        await api.post('/auth/admin-reset-password', {
          userId: editingTeacher.id,
          newPassword: formData.password
        })
        toast.success(`Password reset successfully for ${editingTeacher.name}`)
      } else if (formData.password && formData.password.length < 6) {
        toast.warning(isArabic ? 'كلمة المرور غير محدثة (6 أحرف على الأقل)' : 'Password not updated (minimum 6 characters required)')
      }
      
      toast.success(t('Teacher updated successfully', lang))
      setShowEditModal(false)
      setEditingTeacher(null)
      setFormData({ name: '', phone: '', role: 'teacher', password: '' })
      fetchTeachers()
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to update teacher', lang))
    } finally {
      setSaving(false)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTeachers = teachers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(teachers.length / itemsPerPage)

  return (
    <DashboardLayout 
      title={t('Teachers', lang)} 
      subtitle={t('Manage all teachers in the center', lang)}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">{t('Teachers', lang)}</h2>
          <p className="text-sm text-muted">{teachers.length} {t('total teachers', lang)}</p>
        </div>
        <button onClick={() => navigate('/admin/users')} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
          <FaUserPlus /> {t('Add Teacher', lang)}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={t('Search teachers by name, email, or phone...', lang)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button onClick={handleSearch} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">{t('Search', lang)}</button>
          <button onClick={() => { setSearchTerm(''); fetchTeachers() }} className="px-6 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors">{t('Clear', lang)}</button>
        </div>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading teachers...', lang)}</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaChalkboardTeacher className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{t('No Teachers Found', lang)}</h3>
          <p className="text-muted mt-2">{t('Add teachers from the Users page', lang)}</p>
          <button onClick={() => navigate('/admin/users')} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            {t('Go to Users', lang)}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTeachers.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-xl border border-beige p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-lg">
                      {teacher.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-dark">{teacher.name}</h3>
                      <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full">{teacher.role}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/admin/teachers/${teacher.id}`)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title={t('View Profile', lang)}><FaEye /></button>
                    <button
                      onClick={() => { setEditingTeacher(teacher); setFormData({ name: teacher.name, phone: teacher.phone || '', role: teacher.role, password: '' }); setShowEditModal(true) }}
                      className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors" title={t('Edit', lang)}
                    ><FaEdit /></button>
                    <button onClick={() => { setSelectedTeacher(teacher); setShowDeleteModal(true) }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={t('Delete', lang)}><FaTrash /></button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted"><FaEnvelope className="text-primary text-xs" /><span>{teacher.email}</span></div>
                  {teacher.phone && <div className="flex items-center gap-2 text-muted"><FaPhone className="text-primary text-xs" /><span>{teacher.phone}</span></div>}
                  <div className="flex items-center gap-2 text-muted"><FaUserTag className="text-primary text-xs" /><span>{t('Teacher ID', lang)}: #{teacher.id}</span></div>
                </div>

                <div className="mt-4 pt-4 border-t border-beige">
                  <div className="text-xs text-muted">{t('Joined', lang)}: {new Date(teacher.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted">{t('Showing', lang)} {indexOfFirstItem + 1} {t('to', lang)} {Math.min(indexOfLastItem, teachers.length)} {t('of', lang)} {teachers.length}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronLeft /></button>
                <span className="px-4 py-2 border border-primary bg-primary/10 rounded-lg text-primary">{currentPage}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronRight /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
            <h3 className="text-2xl font-bold text-primary-dark mb-4">{t('Edit Teacher', lang)}</h3>
            <p className="text-sm text-muted mb-4">{isArabic ? 'تحديث معلومات المعلمة. اترك كلمة المرور فارغة للحفاظ على كلمة المرور الحالية.' : 'Update teacher information. Leave password empty to keep current password.'}</p>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-text mb-1">{t('Full Name', lang)} *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-text mb-1">{t('Phone', lang)}</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-text mb-1">{t('Role', lang)}</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"><option value="teacher">{t('Teacher', lang)}</option><option value="admin">{t('Admin', lang)}</option></select></div>
              <div className="border-t border-beige pt-4">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-medium text-yellow-700 mb-2 flex items-center gap-2"><FaKey className="text-yellow-500" /> {t('Reset Password', lang)}</h4>
                  <p className="text-xs text-yellow-600 mb-2">{isArabic ? 'أدخل كلمة مرور جديدة لإعادة تعيين كلمة مرور المعلمة. اترك فارغاً للحفاظ على كلمة المرور الحالية.' : 'Enter a new password to reset the teacher\'s password. Leave empty to keep current password.'}</p>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={isArabic ? 'أدخل كلمة مرور جديدة (6 أحرف على الأقل)' : 'Enter new password (min 6 characters)'} className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"><FaSave /> {saving ? t('Saving...', lang) : t('Update Teacher', lang)}</button>
                <button type="button" onClick={() => { setShowEditModal(false); setEditingTeacher(null); setFormData({ name: '', phone: '', role: 'teacher', password: '' }) }} className="flex-1 bg-gray-100 text-text py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"><FaTimes /> {t('Cancel', lang)}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><FaTrash className="text-2xl text-red-500" /></div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">{t('Delete Teacher', lang)}</h3>
              <p className="text-muted">{t('Are you sure you want to delete', lang)} <strong>{selectedTeacher.name}</strong>?<br />{t('This action cannot be undone', lang)}</p>
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

export default Teachers