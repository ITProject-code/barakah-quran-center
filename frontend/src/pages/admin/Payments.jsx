import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaPlus, FaSearch, FaEdit, FaTrash, FaEye,
  FaMoneyBillWave, FaChevronLeft, FaChevronRight,
  FaFileAlt, FaChartBar, FaCalendarAlt,
  FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle
} from 'react-icons/fa'

const Payments = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [summary, setSummary] = useState(null)

  const itemsPerPage = 10

  useEffect(() => {
    fetchPayments()
    fetchSummary()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/payments')
      setPayments(response.data.payments || [])
    } catch (error) {
      toast.error(t('Failed to fetch payments', lang))
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await api.get('/payments/summary')
      setSummary(response.data.summary)
    } catch (error) {
      console.log('No payment summary yet')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/payments/${selectedPayment.id}`)
      toast.success(t('Payment deleted successfully', lang))
      setShowDeleteModal(false)
      fetchPayments()
      fetchSummary()
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
      paid: <FaCheckCircle className="text-green-500" />,
      pending: <FaClock className="text-yellow-500" />,
      overdue: <FaExclamationTriangle className="text-red-500" />,
      partial: <FaClock className="text-blue-500" />,
      cancelled: <FaTimesCircle className="text-gray-500" />
    }
    return icons[status] || <FaClock className="text-gray-500" />
  }

  const getTypeBadge = (type) => {
    const badges = {
      registration: 'bg-purple-100 text-purple-700',
      monthly: 'bg-blue-100 text-blue-700',
      other: 'bg-gray-100 text-gray-700'
    }
    return badges[type] || 'bg-gray-100 text-gray-700'
  }

  // Filter payments
  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus
    const matchesType = filterType === 'all' || p.payment_type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)

  return (
    <DashboardLayout 
      title={t('Payments', lang)} 
      subtitle={t('Manage all payments in the center', lang)}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">{t('Payments', lang)}</h2>
          <p className="text-sm text-muted">{payments.length} {t('total payments', lang)}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/payments/reports')}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
          >
            <FaChartBar />
            {t('Reports', lang)}
          </button>
          <button
            onClick={() => navigate('/admin/payments/add')}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <FaPlus />
            {t('Add Payment', lang)}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-beige">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary-dark">
                {payments.filter(p => p.status === 'paid').length}
              </div>
              <div className="text-xs text-muted">{t('Paid', lang)}</div>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-beige">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {payments.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-xs text-muted">{t('Pending', lang)}</div>
            </div>
            <FaClock className="text-2xl text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-beige">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-500">
                {payments.filter(p => p.status === 'overdue').length}
              </div>
              <div className="text-xs text-muted">{t('Overdue', lang)}</div>
            </div>
            <FaExclamationTriangle className="text-2xl text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-beige">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gold">
                {summary?.total_amount ? parseFloat(summary.total_amount).toLocaleString() : '0'} ETB
              </div>
              <div className="text-xs text-muted">{t('Total Amount', lang)}</div>
            </div>
            <FaMoneyBillWave className="text-2xl text-gold" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-beige">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary-dark">
                {summary?.unique_students || 0}
              </div>
              <div className="text-xs text-muted">{t('Students', lang)}</div>
            </div>
            <FaFileAlt className="text-2xl text-primary" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={t('Search by student or reference...', lang)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="all">{t('All Status', lang)}</option>
            <option value="paid">{t('Paid', lang)}</option>
            <option value="pending">{t('Pending', lang)}</option>
            <option value="overdue">{t('Overdue', lang)}</option>
            <option value="partial">{t('Partial', lang)}</option>
            <option value="cancelled">{t('Cancelled', lang)}</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="all">{t('All Types', lang)}</option>
            <option value="monthly">{t('Monthly', lang)}</option>
            <option value="registration">{t('Registration', lang)}</option>
            <option value="other">{t('Other', lang)}</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterStatus('all')
              setFilterType('all')
            }}
            className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors"
          >
            {t('Clear', lang)}
          </button>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading payments...', lang)}</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-beige">
          <FaMoneyBillWave className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{t('No Payments Found', lang)}</h3>
          <p className="text-muted mt-2">{t('Start by recording your first payment', lang)}</p>
          <button
            onClick={() => navigate('/admin/payments/add')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('Add Payment', lang)}
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-beige overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-beige">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Student', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Amount', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Type', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Status', lang)}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Date', lang)}</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase">{t('Actions', lang)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {currentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-beige/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {payment.student_name?.charAt(0) || 'S'}
                          </div>
                          <span className="font-medium text-text">{payment.student_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary-dark">
                        {parseFloat(payment.amount).toLocaleString()} ETB
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadge(payment.payment_type)}`}>
                          {isArabic ? (
                            payment.payment_type === 'monthly' ? 'شهري' :
                            payment.payment_type === 'registration' ? 'تسجيل' :
                            payment.payment_type === 'other' ? 'أخرى' :
                            payment.payment_type
                          ) : payment.payment_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(payment.status)}`}>
                            {isArabic ? (
                              payment.status === 'paid' ? 'مدفوع' :
                              payment.status === 'pending' ? 'معلق' :
                              payment.status === 'overdue' ? 'متأخر' :
                              payment.status === 'partial' ? 'جزئي' :
                              payment.status === 'cancelled' ? 'ملغي' :
                              payment.status
                            ) : payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/payments/${payment.id}`)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title={t('View', lang)}
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/payments/edit/${payment.id}`)}
                            className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
                            title={t('Edit', lang)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPayment(payment)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title={t('Delete', lang)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted">
                {t('Showing', lang)} {indexOfFirstItem + 1} {t('to', lang)} {Math.min(indexOfLastItem, filteredPayments.length)} {t('of', lang)} {filteredPayments.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft />
                </button>
                <span className="px-4 py-2 border border-primary bg-primary/10 rounded-lg text-primary">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-beige rounded-lg hover:bg-beige/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-2xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">{t('Delete Payment', lang)}</h3>
              <p className="text-muted">
                {t('Are you sure you want to delete this payment of', lang)} <strong>{parseFloat(selectedPayment.amount).toLocaleString()} ETB</strong>?<br />
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

export default Payments