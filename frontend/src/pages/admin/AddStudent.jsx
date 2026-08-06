import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FaSave, FaTimes, FaUser, FaPhone, FaCalendar, FaBook, FaChalkboardTeacher } from 'react-icons/fa'

const AddStudent = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])

  const [formData, setFormData] = useState({
    fullName: '',
    arabicName: '',
    guardianName: '',
    guardianPhone: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    classId: '',
    teacherId: ''
  })

  useEffect(() => {
    fetchTeachers()
    fetchClasses()
  }, [])

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
      const response = await api.post('/students', formData)
      toast.success(`Student ${response.data.student.full_name} ${t('created successfully!', lang)}`)
      navigate('/admin/students')
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to create student', lang))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout 
      title={t('Add New Student', lang)} 
      subtitle={t('Register a new student in the center', lang)}
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

            {/* Enrollment Date */}
            <div>
              <label className="block text-sm font-medium text-text mb-1"><FaCalendar className="inline mr-2 text-primary" /> {t('Enrollment Date', lang)}</label>
              <input type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1"><FaChalkboardTeacher className="inline mr-2 text-primary" /> {t('Assigned Teacher', lang)}</label>
              <select name="teacherId" value={formData.teacherId} onChange={handleChange} className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">{t('Select Teacher', lang)}</option>
                {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-beige">
            <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <FaSave /> {loading ? t('Saving...', lang) : t('Save Student', lang)}
            </button>
            <button type="button" onClick={() => navigate('/admin/students')} className="px-6 py-2.5 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2">
              <FaTimes /> {t('Cancel', lang)}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default AddStudent