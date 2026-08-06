import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock,
  FaMoneyBillWave, FaUsers, FaFileAlt, FaPrint,
  FaDownload, FaCalendarAlt, FaSearch, FaEye,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa'

const ClassPayments = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [paymentData, setPaymentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [currentPage, setCurrentPage] = useState(1)
  const [availableYears, setAvailableYears] = useState([])
  const itemsPerPage = 10

  useEffect(() => {
    fetchClasses()
    fetchYears()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchClassPayments()
    }
  }, [selectedClass, month, year])

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes')
      setClasses(response.data.classes || [])
    } catch (error) {
      toast.error(t('Failed to fetch classes', lang))
    }
  }

  const fetchYears = async () => {
    try {
      const response = await api.get('/academic-years')
      const years = response.data.years || []
      const yearOptions = years.map(y => parseInt(y.year.split('-')[0]))
      setAvailableYears(yearOptions.length > 0 ? yearOptions : [new Date().getFullYear()])
    } catch (error) {
      setAvailableYears([new Date().getFullYear()])
    }
  }

  const fetchClassPayments = async () => {
    if (!selectedClass) return
    
    try {
      setLoading(true)
      const response = await api.get(`/payments/class/${selectedClass}/status?month=${month}&year=${year}`)
      setPaymentData(response.data)
    } catch (error) {
      toast.error(t('Failed to fetch payment data', lang))
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      paid: 'bg-green-100 text-green-700',
      unpaid: 'bg-red-100 text-red-700',
      partial: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-blue-100 text-blue-700'
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status) => {
    const icons = {
      paid: <FaCheckCircle className="text-green-500" />,
      unpaid: <FaTimesCircle className="text-red-500" />,
      partial: <FaClock className="text-yellow-500" />,
      pending: <FaClock className="text-blue-500" />
    }
    return icons[status] || <FaClock className="text-gray-500" />
  }

  const formatCurrency = (amount) => {
    if (!amount) return '0.00'
    const num = parseFloat(amount)
    if (isNaN(num)) return '0.00'
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const calculateTotalCollected = () => {
    if (!paymentData?.students) return 0
    return paymentData.students
      .filter(s => s.paymentStatus === 'paid')
      .reduce((sum, s) => sum + (parseFloat(s.paymentAmount) || 0), 0)
  }

  const students = paymentData?.students || []
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(students.length / itemsPerPage)

  const paidStudents = students.filter(s => s.paymentStatus === 'paid')
  const unpaidStudents = students.filter(s => s.paymentStatus === 'unpaid')
  const totalCollected = calculateTotalCollected()

  if (!selectedClass) {
    return (
      <DashboardLayout 
        title={t('Class Payment View', lang)} 
        subtitle={t('View payment status by class', lang)}
      >
        <div className="bg-white rounded-xl p-8 border border-beige text-center">
          <FaUsers className="text-6xl text-muted/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-dark">{t('Select a Class', lang)}</h3>
          <p className="text-muted mt-2">{t('Choose a class to view payment status', lang)}</p>
          <div className="max-w-md mx-auto mt-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2.5 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">{t('Select a class', lang)}</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={t('Class Payment View', lang)} 
      subtitle={paymentData?.class?.name || t('Payment status', lang)}
    >
      {/* Header */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setSelectedClass('')}
          className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"
        >
          <FaArrowLeft />
          {t('Change Class', lang)}
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
        >
          <FaPrint />
          {t('Print', lang)}
        </button>
        <button
          onClick={fetchClassPayments}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <FaSearch />
          {t('Refresh', lang)}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-text mb-1">{t('Class', lang)}</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">{t('Month', lang)}</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString(isArabic ? 'ar' : 'en', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">{t('Year', lang)}</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {paymentData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-beige">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary-dark">
                  {paymentData.summary?.totalStudents || 0}
                </div>
                <div className="text-xs text-muted">{t('Total Students', lang)}</div>
              </div>
              <FaUsers className="text-2xl text-primary" />
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {paymentData.summary?.paid || 0}
                </div>
                <div className="text-xs text-green-600">{t('Paid', lang)}</div>
              </div>
              <FaCheckCircle className="text-2xl text-green-500" />
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {paymentData.summary?.unpaid || 0}
                </div>
                <div className="text-xs text-red-500">{t('Unpaid', lang)}</div>
              </div>
              <FaTimesCircle className="text-2xl text-red-500" />
            </div>
          </div>
          <div className="bg-gold/10 rounded-xl p-4 border border-gold/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gold">
                  {formatCurrency(totalCollected)} ETB
                </div>
                <div className="text-xs text-gold">{t('Total Collected', lang)}</div>
              </div>
              <FaMoneyBillWave className="text-2xl text-gold" />
            </div>
          </div>
        </div>
      )}

      {/* Paid vs Unpaid List */}
      {paymentData && paymentData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Paid Students */}
          <div className="bg-white rounded-xl border border-green-200 overflow-hidden">
            <div className="px-4 py-3 bg-green-50 border-b border-green-200 flex items-center justify-between">
              <span className="font-semibold text-green-700 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                {t('Paid Students', lang)} ({paymentData.summary?.paid || 0})
              </span>
            </div>
            <div className="p-4 max-h-48 overflow-y-auto">
              {paidStudents.length === 0 ? (
                <p className="text-muted text-sm">{t('No paid students', lang)}</p>
              ) : (
                paidStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between py-2 border-b border-beige last:border-0">
                    <span className="text-sm text-text">{student.full_name}</span>
                    <span className="text-xs text-green-600 font-medium">{formatCurrency(student.paymentAmount)} ETB</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Unpaid Students */}
          <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
            <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-center justify-between">
              <span className="font-semibold text-red-700 flex items-center gap-2">
                <FaTimesCircle className="text-red-500" />
                {t('Unpaid Students', lang)} ({paymentData.summary?.unpaid || 0})
              </span>
            </div>
            <div className="p-4 max-h-48 overflow-y-auto">
              {unpaidStudents.length === 0 ? (
                <p className="text-muted text-sm">{t('All students have paid!', lang)}</p>
              ) : (
                unpaidStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between py-2 border-b border-beige last:border-0">
                    <span className="text-sm text-text">{student.full_name}</span>
                    <button
                      onClick={() => navigate(`/admin/payments/add?student=${student.id}`)}
                      className="text-xs text-primary hover:underline"
                    >
                      {t('Record Payment', lang)}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Student List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">{t('Loading students...', lang)}</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-beige">
          <p className="text-muted">{t('No students found in this class', lang)}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-beige overflow-hidden">
          <div className="px-6 py-3 bg-beige/30 border-b border-beige flex justify-between items-center">
            <span className="font-semibold text-primary-dark">
              {t('All Students', lang)} - {paymentData?.monthName} {paymentData?.year}
            </span>
            <span className="text-sm text-muted">
              {t('Default Amount', lang)}: {paymentData?.students?.[0]?.defaultAmount || 0} ETB
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Student', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('ID', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Amount', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Status', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Date', lang)}</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase">{t('Action', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-beige/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {student.full_name?.charAt(0) || 'S'}
                        </div>
                        <span className="font-medium text-text">{student.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-muted">{student.student_id}</td>
                    <td className="px-6 py-4 font-medium text-primary-dark">
                      {student.paymentAmount 
                        ? `${formatCurrency(student.paymentAmount)} ETB`
                        : `${student.defaultAmount || 0}.00 ETB`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(student.paymentStatus)}
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(student.paymentStatus)}`}>
                          {isArabic ? (
                            student.paymentStatus === 'paid' ? 'مدفوع' :
                            student.paymentStatus === 'unpaid' ? 'غير مدفوع' :
                            student.paymentStatus === 'partial' ? 'جزئي' :
                            student.paymentStatus === 'pending' ? 'معلق' :
                            student.paymentStatus
                          ) : student.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {student.paymentDate 
                        ? new Date(student.paymentDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {student.paymentStatus === 'unpaid' ? (
                        <button
                          onClick={() => navigate(`/admin/payments/add?student=${student.id}`)}
                          className="text-xs bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          {t('Add Payment', lang)}
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/admin/payments/${student.paymentId}`)}
                          className="text-xs text-primary hover:underline"
                        >
                          <FaEye className="inline mr-1" />
                          {t('View', lang)}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-beige">
              <p className="text-sm text-muted">
                {t('Showing', lang)} {indexOfFirstItem + 1} {t('to', lang)} {Math.min(indexOfLastItem, students.length)} {t('of', lang)} {students.length}
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
        </div>
      )}
    </DashboardLayout>
  )
}

export default ClassPayments