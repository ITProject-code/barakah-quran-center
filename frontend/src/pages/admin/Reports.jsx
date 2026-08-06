import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaChartBar, FaMoneyBillWave, FaUsers, FaFileAlt,
  FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle,
  FaPrint, FaDownload, FaSync, FaCalendarAlt,
  FaArrowLeft, FaChartLine, FaDatabase
} from 'react-icons/fa'

const Reports = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState([])
  const [students, setStudents] = useState([])
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (availableYears.length > 0) {
      fetchMonthlyData()
    }
  }, [selectedMonth, selectedYear])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const yearsResponse = await api.get('/academic-years')
      const years = yearsResponse.data.years || []
      const yearOptions = years.map(y => parseInt(y.year.split('-')[0]))
      const finalYears = yearOptions.length > 0 ? yearOptions : [new Date().getFullYear()]
      setAvailableYears(finalYears)
      
      if (finalYears.length > 0) {
        const currentYear = new Date().getFullYear()
        if (!finalYears.includes(selectedYear)) {
          setSelectedYear(finalYears[0])
        }
      }
      
      await fetchSummary()
      await fetchMonthlyData()
      
      const studentsRes = await api.get('/students')
      setStudents(studentsRes.data.students || [])
      
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast.error(t('Failed to fetch reports', lang))
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const summaryRes = await api.get('/payments/summary')
      setSummary(summaryRes.data.summary)
      if (summaryRes.data.summary?.total_payments > 0) {
        setHasData(true)
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const fetchMonthlyData = async () => {
    try {
      const monthlyRes = await api.get(`/payments/monthly?year=${selectedYear}&month=${selectedMonth}`)
      const data = monthlyRes.data.summary || []
      setMonthlyData(data)
      if (data.length > 0) {
        setHasData(true)
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error)
      setMonthlyData([])
    }
  }

  const formatCurrency = (amount) => {
    if (!amount) return '0.00'
    const num = parseFloat(amount)
    if (isNaN(num)) return '0.00'
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    toast.success(t('Report exported successfully!', lang))
  }

  const handleRefresh = () => {
    fetchSummary()
    fetchMonthlyData()
    toast.success(t('Data refreshed!', lang))
  }

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value))
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value))
  }

  const totalPayments = monthlyData.reduce((sum, item) => sum + (item.count || 0), 0)
  const totalPaid = monthlyData.reduce((sum, item) => sum + (item.paid_count || 0), 0)
  const totalUnpaid = monthlyData.reduce((sum, item) => sum + (item.count - item.paid_count), 0)
  const totalAmount = monthlyData.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0)
  const totalPaidAmount = monthlyData.reduce((sum, item) => sum + parseFloat(item.paid_amount || 0), 0)

  const paymentTypeBreakdown = monthlyData.map(item => ({
    type: item.payment_type,
    count: item.count,
    total: item.total_amount,
    paid: item.paid_count,
    paidAmount: item.paid_amount
  }))

  const monthlyPerformance = {
    collectionRate: totalAmount > 0 ? Math.round((totalPaidAmount / totalAmount) * 100) : 0,
    studentParticipation: students.length > 0 ? Math.round((totalPayments / (students.length || 1)) * 100) : 0,
    averagePayment: totalPayments > 0 ? totalAmount / totalPayments : 0
  }

  if (loading) {
    return (
      <DashboardLayout title={t('Reports', lang)} subtitle={t('Loading...', lang)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">{t('Loading reports...', lang)}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={t('Reports & Analytics', lang)} 
      subtitle={`${t('Payment analytics for', lang)} ${new Date(2000, selectedMonth - 1, 1).toLocaleString(isArabic ? 'ar' : 'en', { month: 'long' })} ${selectedYear}`}
    >
      {/* Header */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"
        >
          <FaArrowLeft />
          {t('Back to Dashboard', lang)}
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
        >
          <FaPrint />
          {t('Print', lang)}
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
        >
          <FaDownload />
          {t('Export', lang)}
        </button>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <FaSync />
          {t('Refresh', lang)}
        </button>
      </div>

      {/* No Data Message */}
      {!hasData && (
        <div className="bg-yellow-50 rounded-xl p-8 border border-yellow-200 text-center mb-6">
          <FaDatabase className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-yellow-700">{t('No Payment Data Found', lang)}</h3>
          <p className="text-yellow-600 mt-2">
            {t('There are no payment records in the system yet. Start by recording payments from the Payments page.', lang)}
          </p>
          <button
            onClick={() => navigate('/admin/payments/add')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FaMoneyBillWave className="inline mr-2" />
            {t('Record First Payment', lang)}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              <FaCalendarAlt className="inline mr-1 text-primary" />
              {t('Month', lang)}
            </label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1, 1).toLocaleString(isArabic ? 'ar' : 'en', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">{t('Year', lang)}</label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t('Update', lang)}
          </button>
        </div>
      </div>

      {/* Summary Cards - Only show if has data */}
      {hasData && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-beige">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary-dark">
                    {formatCurrency(totalAmount)} {t('ETB', lang)}
                  </div>
                  <div className="text-xs text-muted">{t('Total Revenue', lang)}</div>
                </div>
                <FaMoneyBillWave className="text-2xl text-gold" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-beige">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary-dark">
                    {formatNumber(totalPayments)}
                  </div>
                  <div className="text-xs text-muted">{t('Total Payments', lang)}</div>
                </div>
                <FaFileAlt className="text-2xl text-primary" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-beige">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(totalPaid)}
                  </div>
                  <div className="text-xs text-muted">{t('Paid', lang)}</div>
                </div>
                <FaCheckCircle className="text-2xl text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-beige">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {formatNumber(totalUnpaid)}
                  </div>
                  <div className="text-xs text-muted">{t('Unpaid', lang)}</div>
                </div>
                <FaTimesCircle className="text-2xl text-red-500" />
              </div>
            </div>
          </div>

          {/* Payment Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-beige">
              <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
                <FaChartBar className="text-primary" />
                {t('Payment Type Breakdown', lang)}
              </h3>
              {paymentTypeBreakdown.length === 0 ? (
                <p className="text-muted text-sm">{t('No data for this month', lang)}</p>
              ) : (
                <div className="space-y-3">
                  {paymentTypeBreakdown.map((item, index) => {
                    const percentage = totalAmount > 0 ? Math.round((parseFloat(item.total) / totalAmount) * 100) : 0
                    const typeLabels = {
                      monthly: isArabic ? 'شهري' : 'Monthly',
                      registration: isArabic ? 'تسجيل' : 'Registration',
                      other: isArabic ? 'أخرى' : 'Other'
                    }
                    return (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium">{typeLabels[item.type] || item.type}</span>
                          <span className="text-muted">
                            {formatCurrency(item.total)} {t('ETB', lang)} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-beige rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              item.type === 'monthly' ? 'bg-blue-500' :
                              item.type === 'registration' ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted mt-1">
                          <span>{formatNumber(item.count)} {t('payments', lang)}</span>
                          <span>{formatNumber(item.paid)} {t('paid', lang)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 border border-beige">
              <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
                <FaChartLine className="text-gold" />
                {t('Monthly Performance', lang)}
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">{t('Collection Rate', lang)}</span>
                    <span className="text-2xl font-bold text-green-600">
                      {monthlyPerformance.collectionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${monthlyPerformance.collectionRate}%` }}
                    />
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">{t('Student Participation', lang)}</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {monthlyPerformance.studentParticipation}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(monthlyPerformance.studentParticipation, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gold/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gold">{t('Average Payment', lang)}</span>
                    <span className="text-2xl font-bold text-gold">
                      {formatCurrency(monthlyPerformance.averagePayment)} {t('ETB', lang)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links to Other Reports */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/payments')}
              className="bg-white rounded-xl p-4 border border-beige hover:shadow-md transition-shadow text-center group"
            >
              <FaFileAlt className="text-3xl text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-primary-dark">{t('Payment History', lang)}</h4>
              <p className="text-xs text-muted">{t('View all payment records', lang)}</p>
            </button>
            <button
              onClick={() => navigate('/admin/payments/class-view')}
              className="bg-white rounded-xl p-4 border border-beige hover:shadow-md transition-shadow text-center group"
            >
              <FaUsers className="text-3xl text-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-primary-dark">{t('Class Payments', lang)}</h4>
              <p className="text-xs text-muted">{t('View class payment status', lang)}</p>
            </button>
            <button
              onClick={() => navigate('/admin/attendance/reports')}
              className="bg-white rounded-xl p-4 border border-beige hover:shadow-md transition-shadow text-center group"
            >
              <FaCalendarAlt className="text-3xl text-primary-dark mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-primary-dark">{t('Attendance Reports', lang)}</h4>
              <p className="text-xs text-muted">{t('View attendance analytics', lang)}</p>
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default Reports