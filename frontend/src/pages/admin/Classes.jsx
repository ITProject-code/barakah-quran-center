import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaUsers, 
  FaChalkboardTeacher, FaBook, 
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa'

const Classes = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'beginner',
    teacher_id: '',
    max_students: 20,
    status: 'active'
  })

  useEffect(() => {
    fetchClasses()
    fetchTeachers()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/classes')
      setClasses(response.data.classes || [])
    } catch (error) {
      toast.error(t('Failed to fetch classes', lang))
    } finally {
      setLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/users/role/teacher')
      setTeachers(response.data.users || [])
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name) {
      toast.error(t('Class name is required', lang))
      return
    }

    try {
      if (editingClass) {
        await api.put(`/classes/${editingClass.id}`, formData)
        toast.success(t('Class updated successfully', lang))
      } else {
        await api.post('/classes', formData)
        toast.success(t('Class created successfully', lang))
      }
      setShowModal(false)
      setEditingClass(null)
      setFormData({ name: '', description: '', level: 'beginner', teacher_id: '', max_students: 20, status: 'active' })
      fetchClasses()
    } catch (error) {
      toast.error(error.response?.data?.message || t('Operation failed', lang))
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/classes/${selectedClass.id}`)
      toast.success(t('Class deleted successfully', lang))
      setShowDeleteModal(false)
      fetchClasses()
    } catch (error) {
      toast.error(t('Failed to delete class', lang))
    }
  }

  const openCreateModal = () => {
    setEditingClass(null)
    setFormData({ name: '', description: '', level: 'beginner', teacher_id: '', max_students: 20, status: 'active' })
    setShowModal(true)
  }

  const openEditModal = (classData) => {
    setEditingClass(classData)
    setFormData({
      name: classData.name,
      description: classData.description || '',
      level: classData.level || 'beginner',
      teacher_id: classData.teacher_id || '',
      max_students: classData.max_students || 20,
      status: classData.status || 'active'
    })
    setShowModal(true)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentClasses = classes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(classes.length / itemsPerPage)

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

  return (
    <DashboardLayout 
      title={t('Class Management', lang)} 
      subtitle={t('Manage all classes in the center', lang)}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">{t('Classes', lang)}</h2>
          <p className="text-sm text-muted">{classes.length} {t('total classes', lang)}</p>
        </div>
        <button onClick={openCreateModal} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
          <FaPlus /> {t('Add Class', lang)}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading classes...', lang)}</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaBook className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{t('No Classes Found', lang)}</h3>
          <p className="text-muted mt-2">{t('Start by creating your first class', lang)}</p>
          <button onClick={openCreateModal} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">{t('Add Class', lang)}</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentClasses.map((classData) => (
              <div key={classData.id} className="bg-white rounded-xl border border-beige p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-primary-dark text-lg">{classData.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getLevelBadge(classData.level)}`}>
                      {isArabic ? (
                        classData.level === 'beginner' ? 'مبتدئ' :
                        classData.level === 'intermediate' ? 'متوسط' :
                        classData.level === 'advanced' ? 'متقدم' :
                        classData.level === 'expert' ? 'خبير' :
                        classData.level || 'مبتدئ'
                      ) : classData.level || 'Beginner'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ml-2 ${getStatusBadge(classData.status)}`}>
                      {isArabic ? (
                        classData.status === 'active' ? 'نشطة' :
                        classData.status === 'inactive' ? 'غير نشطة' :
                        classData.status === 'completed' ? 'مكتملة' :
                        classData.status || 'نشطة'
                      ) : classData.status || 'Active'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/classes/${classData.id}`)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><FaEye /></button>
                    <button onClick={() => openEditModal(classData)} className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"><FaEdit /></button>
                    <button onClick={() => { setSelectedClass(classData); setShowDeleteModal(true) }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
                  </div>
                </div>

                {classData.description && <p className="text-sm text-muted mb-4 line-clamp-2">{classData.description}</p>}

                <div className="flex items-center gap-6 text-sm text-muted">
                  <div className="flex items-center gap-2"><FaUsers className="text-primary" /><span>{classData.student_count || 0} {t('Students', lang)}</span></div>
                  <div className="flex items-center gap-2"><FaChalkboardTeacher className="text-gold" /><span>{classData.teacher_name || t('No Teacher', lang)}</span></div>
                </div>

                <div className="mt-4 pt-4 border-t border-beige">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{t('Max', lang)}: {classData.max_students || 100} {t('Students', lang)}</span>
                    <span>{t('Created', lang)}: {new Date(classData.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted">{t('Showing', lang)} {indexOfFirstItem + 1} {t('to', lang)} {Math.min(indexOfLastItem, classes.length)} {t('of', lang)} {classes.length}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronLeft /></button>
                <span className="px-4 py-2 border border-primary bg-primary/10 rounded-lg text-primary">{currentPage}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronRight /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-primary-dark mb-4">
              {editingClass ? t('Edit Class', lang) : t('Add New Class', lang)}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-text mb-1">{t('Class Name', lang)} *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder={isArabic ? 'مثال: حلقة أ - متوسط' : 'e.g., Halaqah A - Intermediate'} /></div>
              <div><label className="block text-sm font-medium text-text mb-1">{t('Description', lang)}</label><textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder={isArabic ? 'وصف مختصر للحلقة...' : 'Brief description of the class...'} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-text mb-1">{t('Level', lang)}</label>
                  <select name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="beginner">{t('Beginner', lang)}</option><option value="intermediate">{t('Intermediate', lang)}</option><option value="advanced">{t('Advanced', lang)}</option><option value="expert">{t('Expert', lang)}</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-text mb-1">{t('Max Students', lang)}</label><input type="number" name="max_students" value={formData.max_students} onChange={handleChange} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" min="1" max="100" /></div>
              </div>
              <div><label className="block text-sm font-medium text-text mb-1">{t('Assigned Teacher', lang)}</label>
                <select name="teacher_id" value={formData.teacher_id} onChange={handleChange} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="">{t('Select Teacher', lang)}</option>{teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-text mb-1">{t('Status', lang)}</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="active">{t('Active', lang)}</option><option value="inactive">{t('Inactive', lang)}</option><option value="completed">{t('Completed', lang)}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">{editingClass ? t('Update', lang) : t('Create', lang)}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-text py-2 rounded-lg hover:bg-gray-200 transition-colors">{t('Cancel', lang)}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><FaTrash className="text-2xl text-red-500" /></div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">{t('Delete Class', lang)}</h3>
              <p className="text-muted">{t('Are you sure you want to delete', lang)} <strong>{selectedClass.name}</strong>?<br />{t('This action cannot be undone', lang)}</p>
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

export default Classes