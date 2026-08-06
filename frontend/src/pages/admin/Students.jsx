import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaSearch, FaUserPlus, FaEdit, FaTrash, FaEye, 
  FaUser, FaPhone, FaCalendar, FaMapMarkerAlt,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa'

const Students = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/students')
      setStudents(response.data.students)
    } catch (error) {
      toast.error(t('Failed to fetch students', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchStudents()
      return
    }
    try {
      setLoading(true)
      const response = await api.get(`/students/search/${searchTerm}`)
      setStudents(response.data.students)
    } catch (error) {
      toast.error(t('Search failed', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/students/${selectedStudent.id}`)
      toast.success(t('Student deleted successfully', lang))
      setShowDeleteModal(false)
      fetchStudents()
    } catch (error) {
      toast.error(t('Failed to delete student', lang))
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(students.length / itemsPerPage)

  return (
    <DashboardLayout 
      title={t('Student Management', lang)} 
      subtitle={t('Manage all students in the center', lang)}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">{t('Students', lang)}</h2>
          <p className="text-sm text-muted">{students.length} {t('total students', lang)}</p>
        </div>
        <button onClick={() => navigate('/admin/students/add')} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
          <FaUserPlus /> {t('Add Student', lang)}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={t('Search by name, student ID, or guardian...', lang)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button onClick={handleSearch} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">{t('Search', lang)}</button>
          <button onClick={() => { setSearchTerm(''); fetchStudents() }} className="px-6 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors">{t('Clear', lang)}</button>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading students...', lang)}</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaUser className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{t('No Students Found', lang)}</h3>
          <p className="text-muted mt-2">{t('Start by adding your first student', lang)}</p>
          <button onClick={() => navigate('/admin/students/add')} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">{t('Add Student', lang)}</button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-beige overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-beige">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Student', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Student ID', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Guardian', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Class', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Status', lang)}</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase">{t('Actions', lang)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-beige/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {student.full_name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="font-medium text-text">{student.full_name}</div>
                            {student.arabic_name && <div className="text-xs text-muted font-arabic">{student.arabic_name}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-muted">{student.student_id}</td>
                      <td className="px-6 py-4 text-sm text-muted">{student.guardian_name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-muted">{student.class_name || t('Not Assigned', lang)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full ${
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
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => navigate(`/admin/students/${student.id}`)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title={t('View Profile', lang)}><FaEye /></button>
                          <button onClick={() => navigate(`/admin/students/edit/${student.id}`)} className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors" title={t('Edit', lang)}><FaEdit /></button>
                          <button onClick={() => { setSelectedStudent(student); setShowDeleteModal(true) }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={t('Delete', lang)}><FaTrash /></button>
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
              <p className="text-sm text-muted">{t('Showing', lang)} {indexOfFirstItem + 1} {t('to', lang)} {Math.min(indexOfLastItem, students.length)} {t('of', lang)} {students.length}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronLeft /></button>
                <span className="px-4 py-2 border border-primary bg-primary/10 rounded-lg text-primary">{currentPage}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50"><FaChevronRight /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><FaTrash className="text-2xl text-red-500" /></div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">{t('Delete Student', lang)}</h3>
              <p className="text-muted">{t('Are you sure you want to delete', lang)} <strong>{selectedStudent.full_name}</strong>?<br />{t('This action cannot be undone', lang)}</p>
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

export default Students