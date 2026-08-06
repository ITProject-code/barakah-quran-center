import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaArrowLeft, FaEdit, FaTrash, FaPrint, FaDownload,
  FaUser, FaMoneyBillWave, FaCalendarAlt, FaTag,
  FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle,
  FaStickyNote, FaIdCard, FaReceipt
} from 'react-icons/fa'

const PaymentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchPayment()
  }, [id])

  const fetchPayment = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/payments/${id}`)
      setPayment(response.data.payment)
    } catch (error) {
      toast.error(t('Failed to fetch payment details', lang))
      navigate('/admin/payments')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/payments/${id}`)
      toast.success(t('Payment deleted successfully', lang))
      navigate('/admin/payments')
    } catch (error) {
      toast.error(t('Failed to delete payment', lang))
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700',
      partial: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-gray-100 text-gray-700'
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status) => {
    const icons = {
      paid: <FaCheckCircle className="text-green-500 text-2xl" />,
      pending: <FaClock className="text-yellow-500 text-2xl" />,
      overdue: <FaExclamationTriangle className="text-red-500 text-2xl" />,
      partial: <FaClock className="text-blue-500 text-2xl" />,
      cancelled: <FaTimesCircle className="text-gray-500 text-2xl" />
    }
    return icons[status] || <FaClock className="text-gray-500 text-2xl" />
  }

  const getTypeBadge = (type) => {
    const badges = {
      registration: 'bg-purple-100 text-purple-700',
      monthly: 'bg-blue-100 text-blue-700',
      exam: 'bg-orange-100 text-orange-700',
      certificate: 'bg-pink-100 text-pink-700',
      other: 'bg-gray-100 text-gray-700'
    }
    return badges[type] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <DashboardLayout title={t('Payment Details', lang)} subtitle={t('Loading...', lang)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">{t('Loading payment details...', lang)}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!payment) {
    return (
      <DashboardLayout title={t('Payment Details', lang)} subtitle={t('Payment not found', lang)}>
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <p className="text-muted">{t('Payment not found', lang)}</p>
          <button
            onClick={() => navigate('/admin/payments')}
            className="mt-4 text-primary hover:underline"
          >
            {t('Back to Payments', lang)}
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={t('Payment Details', lang)} 
      subtitle={`${t('Payment', lang)} #${payment.id}`}
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/payments')}
          className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"
        >
          <FaArrowLeft />
          {t('Back', lang)}
        </button>
        <button
          onClick={() => navigate(`/admin/payments/edit/${payment.id}`)}
          className="px-4 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors flex items-center gap-2"
        >
          <FaEdit />
          {t('Edit', lang)}
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <FaTrash />
          {t('Delete', lang)}
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
        >
          <FaPrint />
          {t('Print', lang)}
        </button>
      </div>

      {/* Payment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Status Card */}
        <div className={`rounded-xl p-6 border-2 ${
          payment.status === 'paid' ? 'border-green-200 bg-green-50' :
          payment.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
          payment.status === 'overdue' ? 'border-red-200 bg-red-50' :
          'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-4">
            {getStatusIcon(payment.status)}
            <div>
              <div className="text-sm text-muted">{t('Status', lang)}</div>
              <div className={`text-xl font-bold ${
                payment.status === 'paid' ? 'text-green-700' :
                payment.status === 'pending' ? 'text-yellow-700' :
                payment.status === 'overdue' ? 'text-red-700' :
                'text-gray-700'
              }`}>
                {isArabic ? (
                  payment.status === 'paid' ? 'مدفوع' :
                  payment.status === 'pending' ? 'معلق' :
                  payment.status === 'overdue' ? 'متأخر' :
                  payment.status === 'partial' ? 'جزئي' :
                  payment.status === 'cancelled' ? 'ملغي' :
                  payment.status
                ) : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-white rounded-xl p-6 border border-beige">
          <div className="flex items-center gap-4">
            <FaMoneyBillWave className="text-3xl text-gold" />
            <div>
              <div className="text-sm text-muted">{t('Amount', lang)}</div>
              <div className="text-2xl font-bold text-primary-dark">
                {parseFloat(payment.amount).toLocaleString()} ETB
              </div>
            </div>
          </div>
        </div>

        {/* Type Card */}
        <div className="bg-white rounded-xl p-6 border border-beige">
          <div className="flex items-center gap-4">
            <FaTag className="text-3xl text-primary" />
            <div>
              <div className="text-sm text-muted">{t('Payment Type', lang)}</div>
              <span className={`text-sm px-3 py-1 rounded-full ${getTypeBadge(payment.payment_type)}`}>
                {isArabic ? (
                  payment.payment_type === 'monthly' ? 'شهري' :
                  payment.payment_type === 'registration' ? 'تسجيل' :
                  payment.payment_type === 'exam' ? 'امتحان' :
                  payment.payment_type === 'certificate' ? 'شهادة' :
                  payment.payment_type === 'other' ? 'أخرى' :
                  payment.payment_type
                ) : payment.payment_type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Student & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Info */}
        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
            <FaUser className="text-primary" />
            {t('Student Information', lang)}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted">{t('Student Name', lang)}</label>
              <p className="font-medium text-text">{payment.student_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs text-muted">{t('Student ID', lang)}</label>
              <p className="font-medium text-text font-mono">{payment.student_id_num || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
            <FaReceipt className="text-gold" />
            {t('Payment Details', lang)}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted">{t('Payment Date', lang)}</label>
              <p className="font-medium text-text flex items-center gap-2">
                <FaCalendarAlt className="text-primary text-sm" />
                {new Date(payment.payment_date).toLocaleDateString(isArabic ? 'ar' : 'en', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {payment.due_date && (
              <div>
                <label className="text-xs text-muted">{t('Due Date', lang)}</label>
                <p className="font-medium text-text flex items-center gap-2">
                  <FaCalendarAlt className="text-primary text-sm" />
                  {new Date(payment.due_date).toLocaleDateString(isArabic ? 'ar' : 'en', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            {payment.payment_method && (
              <div>
                <label className="text-xs text-muted">{t('Payment Method', lang)}</label>
                <p className="font-medium text-text capitalize">
                  {isArabic ? (
                    payment.payment_method === 'cash' ? 'نقدي' :
                    payment.payment_method === 'bank_transfer' ? 'تحويل بنكي' :
                    payment.payment_method
                  ) : payment.payment_method.replace('_', ' ')}
                </p>
              </div>
            )}
            {payment.reference_number && (
              <div>
                <label className="text-xs text-muted">{t('Reference Number', lang)}</label>
                <p className="font-medium text-text font-mono">{payment.reference_number}</p>
              </div>
            )}
            <div>
              <label className="text-xs text-muted">{t('Recorded By', lang)}</label>
              <p className="font-medium text-text">{payment.recorded_by_name || 'System'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {payment.notes && (
        <div className="mt-6 bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-2 flex items-center gap-2">
            <FaStickyNote className="text-primary" />
            {t('Notes', lang)}
          </h3>
          <p className="text-muted">{payment.notes}</p>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-2xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">{t('Delete Payment', lang)}</h3>
              <p className="text-muted">
                {t('Are you sure you want to delete this payment of', lang)} <strong>{parseFloat(payment.amount).toLocaleString()} ETB</strong>?<br />
                {t('This action cannot be undone', lang)}
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors"
                >
                  {t('Cancel', lang)}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {t('Delete', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default PaymentDetails