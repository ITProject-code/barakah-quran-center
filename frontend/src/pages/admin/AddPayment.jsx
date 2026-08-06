import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FaSave, FaTimes, FaUser, FaMoneyBillWave, FaCalendarAlt, FaTag, FaStickyNote, FaBook } from 'react-icons/fa'

const AddPayment = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])

  const [formData, setFormData] = useState({
    classId: '',
    studentId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentType: 'monthly',
    paymentMethod: 'cash',
    status: 'paid',
    referenceNumber: '',
    notes: ''
  })

  useEffect(() => {
    fetchClasses()
    fetchStudents()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes')
      setClasses(response.data.classes || [])
    } catch (error) {
      toast.error(t('Failed to fetch classes', lang))
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students')
      const allStudents = response.data.students || []
      setStudents(allStudents)
      setFilteredStudents(allStudents)
    } catch (error) {
      toast.error(t('Failed to fetch students', lang))
    }
  }

  useEffect(() => {
    if (formData.classId) {
      const filtered = students.filter(s => s.class_id === parseInt(formData.classId))
      setFilteredStudents(filtered)
      setFormData(prev => ({ ...prev, studentId: '' }))
    } else {
      setFilteredStudents(students)
    }
  }, [formData.classId, students])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.studentId || !formData.amount) {
      toast.error(t('Student and amount are required', lang))
      return
    }

    setLoading(true)
    try {
      await api.post('/payments', formData)
      toast.success(t('Payment recorded successfully!', lang))
      navigate('/admin/payments')
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to record payment', lang))
    } finally {
      setLoading(false)
    }
  }

  const getClassName = (classId) => {
    const cls = classes.find(c => c.id === parseInt(classId))
    return cls?.name || ''
  }

  return (
    <DashboardLayout 
      title={t('Record Payment', lang)} 
      subtitle={t('Add a new payment', lang)}
    >
      <div className="bg-white rounded-xl border border-beige p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                <FaBook className="inline mr-2 text-primary" />
                {t('Class', lang)}
              </label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">{t('Select Class', lang)}</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.student_count || 0} {t('students', lang)})
                  </option>
                ))}
              </select>
              {formData.classId && (
                <p className="text-xs text-muted mt-1">
                  {filteredStudents.length} {t('students in this class', lang)}
                </p>
              )}
            </div>

            {/* Student */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                <FaUser className="inline mr-2 text-primary" />
                {t('Student', lang)} *
              </label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">
                  {formData.classId 
                    ? t('Select Student', lang)
                    : t('Select Class first', lang)}
                </option>
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.student_id})
                  </option>
                ))}
              </select>
              {!formData.classId && (
                <p className="text-xs text-yellow-600 mt-1">
                  {t('Please select a class first', lang)}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                <FaMoneyBillWave className="inline mr-2 text-primary" />
                {t('Amount (ETB)', lang)} *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder={t('e.g., 500', lang)}
              />
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                <FaCalendarAlt className="inline mr-2 text-primary" />
                {t('Payment Date', lang)}
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                <FaTag className="inline mr-2 text-primary" />
                {t('Payment Type', lang)} *
              </label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="monthly">{t('Monthly', lang)}</option>
                <option value="registration">{t('Registration', lang)}</option>
                <option value="other">{t('Other', lang)}</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">{t('Payment Method', lang)}</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="cash">{t('Cash', lang)}</option>
                <option value="bank_transfer">{t('Bank Transfer', lang)}</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">{t('Status', lang)}</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="paid">{t('Paid', lang)}</option>
                <option value="pending">{t('Pending', lang)}</option>
                <option value="partial">{t('Partial', lang)}</option>
                <option value="overdue">{t('Overdue', lang)}</option>
                <option value="cancelled">{t('Cancelled', lang)}</option>
              </select>
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">{t('Reference Number', lang)}</label>
              <input
                type="text"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder={t('e.g., INV-2026-001', lang)}
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">
                <FaStickyNote className="inline mr-2 text-primary" />
                {t('Notes', lang)}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                placeholder={t('Additional notes...', lang)}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-beige">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {loading ? t('Saving...', lang) : t('Save Payment', lang)}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/payments')}
              className="px-6 py-2.5 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"
            >
              <FaTimes />
              {t('Cancel', lang)}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default AddPayment