import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FaSave, FaTimes, FaUser, FaMoneyBillWave, FaCalendarAlt, FaTag, FaStickyNote } from 'react-icons/fa'

const EditPayment = () => {
  const { id } = useParams()
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [students, setStudents] = useState([])

  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentDate: '',
    paymentType: 'monthly',
    paymentMethod: 'cash',
    status: 'paid',
    referenceNumber: '',
    notes: ''
  })

  useEffect(() => {
    fetchStudents()
    fetchPayment()
  }, [id])

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students')
      setStudents(response.data.students || [])
    } catch (error) {
      toast.error(t('Failed to fetch students', lang))
    }
  }

  const fetchPayment = async () => {
    try {
      setFetching(true)
      const response = await api.get(`/payments/${id}`)
      const payment = response.data.payment
      setFormData({
        studentId: payment.student_id || '',
        amount: payment.amount || '',
        paymentDate: payment.payment_date?.split('T')[0] || '',
        paymentType: payment.payment_type || 'monthly',
        paymentMethod: payment.payment_method || 'cash',
        status: payment.status || 'paid',
        referenceNumber: payment.reference_number || '',
        notes: payment.notes || ''
      })
    } catch (error) {
      toast.error(t('Failed to fetch payment details', lang))
      navigate('/admin/payments')
    } finally {
      setFetching(false)
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
    
    if (!formData.studentId || !formData.amount) {
      toast.error(t('Student and amount are required', lang))
      return
    }

    setLoading(true)
    try {
      await api.put(`/payments/${id}`, formData)
      toast.success(t('Payment updated successfully!', lang))
      navigate(`/admin/payments/${id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to update payment', lang))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <DashboardLayout title={t('Edit Payment', lang)} subtitle={t('Loading...', lang)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">{t('Loading payment details...', lang)}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={t('Edit Payment', lang)} 
      subtitle={t('Update payment details', lang)}
    >
      <div className="bg-white rounded-xl border border-beige p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option value="">{t('Select Student', lang)}</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.student_id})
                  </option>
                ))}
              </select>
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
              {loading ? t('Saving...', lang) : t('Update Payment', lang)}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/payments/${id}`)}
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

export default EditPayment