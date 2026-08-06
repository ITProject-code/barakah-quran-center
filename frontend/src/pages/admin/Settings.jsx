import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { 
  FaSave, FaPlus, FaTrash, FaCheck, FaCalendarAlt,
  FaMoneyBillWave, FaCog,
  FaCheckCircle, FaExclamationTriangle,
  FaSync, FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaFileInvoice
} from 'react-icons/fa'

const Settings = () => {
  const { token } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('academic')
  
  // Academic Years
  const [settings, setSettings] = useState({
    activeYear: null,
    allYears: [],
    defaultAmount: 500
  })
  const [newYear, setNewYear] = useState('')
  const [showAddYear, setShowAddYear] = useState(false)

  // Center Information
  const [centerInfo, setCenterInfo] = useState({
    name: 'Barakah Women\'s Quran Center',
    arabicName: 'مركز بركة النسائية لتحفيظ القرآن الكريم',
    address: 'Adama, Ganda Haraa, Ethiopia',
    phone: '+251953104543',
    email: 'abdu0953104844@gmail.com',
  })

  // Financial Settings
  const [financialSettings, setFinancialSettings] = useState({
    defaultMonthlyAmount: 500,
    registrationFee: 200,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      
      const yearsResponse = await api.get('/academic-years')
      const allYears = yearsResponse.data.years || []
      const activeYear = allYears.find(y => y.is_active === true) || null
      
      setSettings({
        activeYear,
        allYears,
        defaultAmount: activeYear?.default_monthly_amount || 500
      })
      
      setFinancialSettings({
        defaultMonthlyAmount: activeYear?.default_monthly_amount || 500,
        registrationFee: 200
      })
    } catch (error) {
      toast.error(t('Failed to fetch settings', lang))
    } finally {
      setLoading(false)
    }
  }

  const handleAddYear = async () => {
    if (!newYear.trim()) {
      toast.error(t('Please enter a year', lang))
      return
    }

    setSaving(true)
    try {
      await api.post('/academic-years', {
        year: newYear.trim(),
        default_monthly_amount: settings.defaultAmount
      })
      toast.success(t('Academic year added successfully', lang))
      setNewYear('')
      setShowAddYear(false)
      fetchSettings()
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to add year', lang))
    } finally {
      setSaving(false)
    }
  }

  const handleSetActive = async (yearId) => {
    setSaving(true)
    try {
      await api.put(`/academic-years/${yearId}/active`, {})
      toast.success(t('Active year updated successfully', lang))
      fetchSettings()
    } catch (error) {
      toast.error(t('Failed to update active year', lang))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateDefaultAmount = async () => {
    if (!settings.activeYear) {
      toast.error(t('No active year found', lang))
      return
    }

    setSaving(true)
    try {
      await api.put(`/academic-years/${settings.activeYear.id}`, {
        default_monthly_amount: settings.defaultAmount
      })
      toast.success(t('Default amount updated successfully', lang))
      fetchSettings()
    } catch (error) {
      toast.error(t('Failed to update default amount', lang))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteYear = async (yearId) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد أنك تريد حذف هذه السنة الأكاديمية؟' : 'Are you sure you want to delete this academic year?')) return
    
    setSaving(true)
    try {
      await api.delete(`/academic-years/${yearId}`)
      toast.success(t('Academic year deleted successfully', lang))
      fetchSettings()
    } catch (error) {
      toast.error(t('Failed to delete year', lang))
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCenterInfo = () => {
    toast.success(t('Center information saved successfully!', lang))
  }

  if (loading) {
    return (
      <DashboardLayout title={t('Settings', lang)} subtitle={t('Loading...', lang)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted mt-4">{t('Loading settings...', lang)}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={t('Settings', lang)} 
      subtitle={t('Manage system settings and configurations', lang)}
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-beige mb-6">
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-4 py-2.5 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'academic'
              ? 'bg-primary text-white'
              : 'text-muted hover:text-primary hover:bg-primary/5'
          }`}
        >
          <FaCalendarAlt className="text-sm" />
          {t('Academic Years', lang)}
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2.5 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'financial'
              ? 'bg-primary text-white'
              : 'text-muted hover:text-primary hover:bg-primary/5'
          }`}
        >
          <FaMoneyBillWave className="text-sm" />
          {t('Financial', lang)}
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-primary text-white'
              : 'text-muted hover:text-primary hover:bg-primary/5'
          }`}
        >
          <FaCog className="text-sm" />
          {t('General', lang)}
        </button>
      </div>

      {/* ==================== ACADEMIC YEARS TAB ==================== */}
      {activeTab === 'academic' && (
        <div className="bg-white rounded-xl border border-beige p-6">
          <h3 className="text-xl font-bold text-primary-dark mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-primary" />
            {t('Academic Years', lang)}
          </h3>

          <div className="space-y-3 mb-4">
            {settings.allYears.length === 0 ? (
              <p className="text-muted text-sm">{t('No academic years added yet', lang)}</p>
            ) : (
              settings.allYears.map((year) => (
                <div
                  key={year.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    year.is_active
                      ? 'border-gold bg-gold/5'
                      : 'border-beige hover:bg-beige/30'
                  } transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    {year.is_active && <FaCheckCircle className="text-gold" />}
                    <span className={`font-medium ${year.is_active ? 'text-gold' : 'text-text'}`}>
                      {year.year}
                    </span>
                    {year.is_active && (
                      <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">{t('Active', lang)}</span>
                    )}
                    <span className="text-xs text-muted">{year.default_monthly_amount} {t('ETB', lang)}/month</span>
                  </div>
                  <div className="flex gap-2">
                    {!year.is_active && (
                      <button
                        onClick={() => handleSetActive(year.id)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title={t('Set as Active', lang)}
                      >
                        <FaCheck className="text-sm" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteYear(year.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('Delete', lang)}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {showAddYear ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder={isArabic ? 'مثال: 2027-2028' : 'e.g., 2027-2028'}
                className="flex-1 px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button
                onClick={handleAddYear}
                disabled={saving}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {t('Add', lang)}
              </button>
              <button
                onClick={() => setShowAddYear(false)}
                className="px-4 py-2 border border-beige rounded-lg hover:bg-beige/30 transition-colors"
              >
                {t('Cancel', lang)}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddYear(true)}
              className="w-full py-2 border-2 border-dashed border-beige rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-sm text-muted hover:text-primary"
            >
              <FaPlus className="inline mr-2" />
              {t('Add Academic Year', lang)}
            </button>
          )}
        </div>
      )}

      {/* ==================== FINANCIAL TAB ==================== */}
      {activeTab === 'financial' && (
        <div className="bg-white rounded-xl border border-beige p-6">
          <h3 className="text-xl font-bold text-primary-dark mb-6 flex items-center gap-2">
            <FaMoneyBillWave className="text-gold" />
            {t('Financial Settings', lang)}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text mb-1">{t('Default Monthly Amount', lang)} ({t('ETB', lang)})</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.defaultAmount}
                  onChange={(e) => setSettings({ ...settings, defaultAmount: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="10"
                  className="flex-1 px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <button
                  onClick={handleUpdateDefaultAmount}
                  disabled={saving || !settings.activeYear}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <FaSave />
                  {t('Save', lang)}
                </button>
              </div>
              <p className="text-xs text-muted mt-1">
                {settings.activeYear ? `${t('Active year', lang)}: ${settings.activeYear.year}` : t('No active year selected', lang)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">{t('Registration Fee', lang)} ({t('ETB', lang)})</label>
              <input
                type="number"
                value={financialSettings.registrationFee}
                onChange={(e) => setFinancialSettings({ ...financialSettings, registrationFee: parseFloat(e.target.value) || 0 })}
                min="0"
                step="10"
                className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="text-xs text-muted mt-1">{t('This will be used as default registration fee', lang)}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
              <FaExclamationTriangle className="text-blue-500" />
              {t('How it works', lang)}
            </h4>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• {t('Default amount is used when creating monthly payments', lang)}</li>
              <li>• {t('Registration fee is applied when a new student registers', lang)}</li>
              <li>• {t('These values can be overridden when recording individual payments', lang)}</li>
            </ul>
          </div>
        </div>
      )}

      {/* ==================== GENERAL TAB ==================== */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl border border-beige p-6">
          <h3 className="text-xl font-bold text-primary-dark mb-6 flex items-center gap-2">
            <FaHome className="text-primary" />
            {t('Center Information', lang)}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text mb-1">{t('Center Name (English)', lang)}</label>
              <input
                type="text"
                value={centerInfo.name}
                onChange={(e) => setCenterInfo({ ...centerInfo, name: e.target.value })}
                className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">{t('Center Name (Arabic)', lang)}</label>
              <input
                type="text"
                value={centerInfo.arabicName}
                onChange={(e) => setCenterInfo({ ...centerInfo, arabicName: e.target.value })}
                className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-arabic"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                <FaMapMarkerAlt className="inline mr-2 text-primary" />
                {t('Address', lang)}
              </label>
              <input
                type="text"
                value={centerInfo.address}
                onChange={(e) => setCenterInfo({ ...centerInfo, address: e.target.value })}
                className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                <FaPhone className="inline mr-2 text-primary" />
                {t('Phone', lang)}
              </label>
              <input
                type="text"
                value={centerInfo.phone}
                onChange={(e) => setCenterInfo({ ...centerInfo, phone: e.target.value })}
                className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">
                <FaEnvelope className="inline mr-2 text-primary" />
                {t('Email', lang)}
              </label>
              <input
                type="email"
                value={centerInfo.email}
                onChange={(e) => setCenterInfo({ ...centerInfo, email: e.target.value })}
                className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-beige">
            <button
              onClick={handleSaveCenterInfo}
              className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <FaSave />
              {t('Save Center Information', lang)}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Settings