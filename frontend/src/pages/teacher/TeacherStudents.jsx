import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaUsers, FaSearch, FaEye, FaUser, FaChevronLeft, FaChevronRight,
  FaPhone, FaUserTag, FaBook, FaStar
} from 'react-icons/fa'

const TeacherStudents = () => {
  const { token, user } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/students/teacher/${user?.id}`)
      setStudents(response.data.students || [])
    } catch (error) {
      toast.error(t('Failed to fetch', lang))
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  return (
    <DashboardLayout 
      title={t('My Students', lang)} 
      subtitle={`${students.length} ${t('total students', lang)}`}
    >
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={t('Search students...', lang)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button onClick={() => { setSearchTerm('') }} className="px-6 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors">
            {t('Clear', lang)}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading students', lang)}</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaUsers className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{t('No students found', lang)}</h3>
          <p className="text-muted mt-2">{t('Start by adding students to your class', lang)}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-xl border border-beige p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {student.full_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text">{student.full_name}</h4>
                      <p className="text-xs text-muted font-mono">{student.student_id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/teacher/students/${student.id}`)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <FaEye />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-beige grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted">{t('Guardian', lang)}:</span>
                    <p className="font-medium">{student.guardian_name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted">{t('Phone', lang)}:</span>
                    <p className="font-medium">{student.guardian_phone || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted">{t('Class', lang)}:</span>
                    <p className="font-medium">{student.class_name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted">{t('Status', lang)}:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isArabic ? (student.status === 'active' ? 'نشطة' : 'غير نشطة') : student.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted">{t('Showing', lang)} {indexOfFirstItem + 1} {t('of', lang)} {Math.min(indexOfLastItem, filteredStudents.length)}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FaChevronLeft />
                </button>
                <span className="px-4 py-2 border border-primary bg-primary/10 rounded-lg text-primary">{currentPage}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default TeacherStudents