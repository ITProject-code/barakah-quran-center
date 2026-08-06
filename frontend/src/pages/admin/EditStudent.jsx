import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FaSave, FaTimes, FaUser, FaPhone, FaBook, FaChalkboardTeacher } from 'react-icons/fa'

const EditStudent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    arabicName: '',
    guardianName: '',
    guardianPhone: '',
    classId: '',
    teacherId: '',
    status: 'active'
  })

  useEffect(() => {
    fetchStudent()
    fetchTeachers()
    fetchClasses()
  }, [id])

  const fetchStudent = async () => {
    try {
      setFetching(true)
      const response = await api.get(`/students/${id}`)
      const student = response.data.student
      setFormData({
        fullName: student.full_name || '',
        arabicName: student.arabic_name || '',
        guardianName: student.guardian_name || '',
        guardianPhone: student.guardian_phone || '',
        classId: student.class_id || '',
        teacherId: student.teacher_id || '',
        status: student.status || 'active'
      })
    } catch (error) {
      toast.error(t('Failed to fetch student details', lang))
      navigate('/admin/students')
    } finally {
      setFetching(false)
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

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes')
      setClasses(response.data.classes || [])
    } catch (error) {
      console.error('Error fetching classes:', error)
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
    
    if (!formData.fullName) {
      toast.error(t('Full name is required', lang))
      return
    }

    setLoading(true)
    try {
      await api.put(`/students/${id}`, formData)
      toast.success(t('Student updated successfully!', lang))
      navigate(`/admin/students/${id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to update student', lang))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <DashboardLayout title={t('Edit Student', lang)} subtitle={t('Loading...', lang)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">{t('Loading student data...', lang)}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={t('Edit Student', lang)} 
      subtitle={`${t('Updating', lang)} ${formData.fullName}`}
    >
      <div className="bg-white rounded-xl border border-beige p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-text mb-1"><FaUser className="inline mr-2 text-primary" /> {t('Full Name', lang)} *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder={isArabic ? 'فاطمة أحمد' : 'e.g., Fatima Ahmed'} />
            </div>

            {/* Arabic Name */}
            <div>
              <label className="block text-sm font-medium text-text mb-1"><FaUser className="inline mr-2 text-primary" /> {t('Arabic Name', lang)}</label>
              <input type="text" name="arabicName" value={formData.arabicName} onChange={handleChange} className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-arabic" placeholder="فاطمة أحمد" dir="rtl" />
            </div>

            {/* Guardian Name */}
            <div>
              <label className="block text-sm font-medium text-text mb-1"><FaUser className="inline mr-2 text-primary" /> {t('Guardian Name', lang)}</label>
              <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder={isArabic ? 'اسم ولي الأمر' : 'Guardian\'s full name'} />
            </div>

            {/* Guardian Phone */}
            <div>
              <label className="block text-sm font-medium text-text mb-1"><FaPhone className="inline mr-2 text-primary" /> {t('Guardian Phone', lang)}</label>
              <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="+251 XXX XXX XXX" />
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-text mb-1"><FaBook className="inline mr-2 text-primary" /> {t('Class', lang)}</label>
              <select name="classId" value={formData.classId} onChange={handleChange} className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">{t('Select Class', lang)}</option>
                {classes.map((cls) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
              </select>
            </div>

            {/* Teacher */}
            <div>
              <label className="block text-sm font-medium text-text mb-1"><FaChalkboardTeacher className="inline mr-2 text-primary" /> {t('Assigned Teacher', lang)}</label>
              <select name="teacherId" value={formData.teacherId} onChange={handleChange} className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">{t('Select Teacher', lang)}</option>
                {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">{t('Status', lang)}</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="active">{t('Active', lang)}</option>
                <option value="inactive">{t('Inactive', lang)}</option>
                <option value="graduated">{t('Graduated', lang)}</option>
                <option value="transferred">{t('Transferred', lang)}</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-beige">
            <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <FaSave /> {loading ? t('Saving...', lang) : t('Update Student', lang)}
            </button>
            <button type="button" onClick={() => navigate(`/admin/students/${id}`)} className="px-6 py-2.5 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2">
              <FaTimes /> {t('Cancel', lang)}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default EditStudent