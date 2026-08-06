import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaChartBar, FaCalendarAlt, FaMoneyBillWave, 
  FaDownload, FaPrint, FaFileAlt,
  FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle,
  FaUsers, FaArrowLeft, FaSync
} from 'react-icons/fa'

const PaymentReports = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState([])

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
      
      await fetchMonthlyData()
      
    } catch (error) {
      toast.error(t('Failed to fetch reports', lang))
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMonthlyData = async () => {
    try {
      setLoading(true)
      const monthlyRes = await api.get(`/payments/monthly?year=${selectedYear}&month=${selectedMonth}`)
      setMonthlyData(monthlyRes.data.summary || [])
    } catch (error) {
      toast.error(t('Failed to fetch monthly data', lang))
      console.error('Error fetching monthly data:', error)
    } finally {
      setLoading(false)
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

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value)
    setSelectedYear(newYear)
  }

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value)
    setSelectedMonth(newMonth)
  }

  const handleRefresh = () => {
    fetchMonthlyData()
    toast.success(t('Data refreshed!', lang))
  }

  const totalPayments = monthlyData.reduce((sum, item) => sum + (item.count || 0), 0)
  const totalPaid = monthlyData.reduce((sum, item) => sum + (item.paid_count || 0), 0)
  const totalUnpaid = monthlyData.reduce((sum, item) => sum + (item.count - item.paid_count), 0)
  const totalAmount = monthlyData.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0)
  const totalPaidAmount = monthlyData.reduce((sum, item) => sum + parseFloat(item.paid_amount || 0), 0)

  if (loading && availableYears.length === 0) {
    return (
      <DashboardLayout title={t('Payment Reports', lang)} subtitle={t('Loading...', lang)}>
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
      title={t('Payment Reports', lang)} 
      subtitle={`${t('Showing data for', lang)} ${new Date(2000, selectedMonth - 1, 1).toLocaleString(isArabic ? 'ar' : 'en', { month: 'long' })} ${selectedYear}`}
    >
      {/* Header */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/payments')}
          className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors flex items-center gap-2"
        >
          <FaArrowLeft />
          {t('Back to Payments', lang)}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-beige">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary-dark">
                {formatCurrency(totalAmount)} ETB
              </div>
              <div className="text-xs text-muted">{t('Total Collected', lang)}</div>
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

      {/* Monthly Filter */}
      <div className="bg-white rounded-xl p-4 border border-beige mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-text mb-1">{t('Month', lang)}</label>
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

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-xl border border-beige overflow-hidden">
        <div className="px-6 py-4 bg-beige/30 border-b border-beige">
          <h3 className="font-semibold text-primary-dark">
            {t('Monthly Breakdown', lang)} - {new Date(2000, selectedMonth - 1, 1).toLocaleString(isArabic ? 'ar' : 'en', { month: 'long' })} {selectedYear}
          </h3>
        </div>
        {monthlyData.length === 0 ? (
          <div className="p-8 text-center text-muted">
            {t('No payment data for', lang)} {new Date(2000, selectedMonth - 1, 1).toLocaleString(isArabic ? 'ar' : 'en', { month: 'long' })} {selectedYear}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Payment Type', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Count', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Total Amount', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Paid', lang)}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">{t('Paid Amount', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {monthlyData.map((item, index) => (
                  <tr key={index} className="hover:bg-beige/10 transition-colors">
                    <td className="px-6 py-4">
                      <span className="capitalize">
                        {isArabic ? (
                          item.payment_type === 'monthly' ? 'شهري' :
                          item.payment_type === 'registration' ? 'تسجيل' :
                          item.payment_type === 'other' ? 'أخرى' :
                          item.payment_type
                        ) : item.payment_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatNumber(item.count)}</td>
                    <td className="px-6 py-4 font-medium text-primary-dark">
                      {formatCurrency(item.total_amount)} ETB
                    </td>
                    <td className="px-6 py-4">{formatNumber(item.paid_count)}</td>
                    <td className="px-6 py-4 font-medium text-green-600">
                      {formatCurrency(item.paid_amount)} ETB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Status & Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
            <FaChartBar className="text-primary" />
            {t('Payment Status', lang)} - {new Date(2000, selectedMonth - 1, 1).toLocaleString(isArabic ? 'ar' : 'en', { month: 'long' })} {selectedYear}
          </h3>
          {monthlyData.length === 0 ? (
            <p className="text-muted text-sm">{t('No data for this month', lang)}</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  {t('Paid', lang)}
                </span>
                <span className="font-bold text-green-700">{formatNumber(totalPaid)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <FaClock className="text-yellow-500" />
                  {t('Pending (Unpaid)', lang)}
                </span>
                <span className="font-bold text-yellow-700">{formatNumber(totalUnpaid)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gold/10 rounded-lg">
                <span className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-gold" />
                  {t('Total Amount', lang)}
                </span>
                <span className="font-bold text-gold">{formatCurrency(totalAmount)} ETB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-500" />
                  {t('Paid Amount', lang)}
                </span>
                <span className="font-bold text-blue-600">{formatCurrency(totalPaidAmount)} ETB</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-beige">
          <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
            <FaFileAlt className="text-gold" />
            {t('Payment Types', lang)} - {new Date(2000, selectedMonth - 1, 1).toLocaleString(isArabic ? 'ar' : 'en', { month: 'long' })} {selectedYear}
          </h3>
          {monthlyData.length === 0 ? (
            <p className="text-muted text-sm">{t('No data for this month', lang)}</p>
          ) : (
            <div className="space-y-3">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-beige/30 rounded-lg">
                  <span className="flex items-center gap-2 capitalize">
                    <FaFileAlt className={
                      item.payment_type === 'monthly' ? 'text-blue-500' :
                      item.payment_type === 'registration' ? 'text-purple-500' :
                      'text-gray-500'
                    } />
                    {isArabic ? (
                      item.payment_type === 'monthly' ? 'شهري' :
                      item.payment_type === 'registration' ? 'تسجيل' :
                      item.payment_type === 'other' ? 'أخرى' :
                      item.payment_type
                    ) : item.payment_type}
                  </span>
                  <div className="flex gap-4 text-sm">
                    <span className="font-medium">{formatNumber(item.count)} {t('payments', lang)}</span>
                    <span className="font-bold text-primary-dark">{formatCurrency(item.total_amount)} ETB</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <span className="font-semibold text-primary-dark">{t('Total', lang)}</span>
                <span className="font-bold text-primary-dark">
                  {formatCurrency(totalAmount)} ETB
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PaymentReports