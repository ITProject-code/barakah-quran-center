import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FaLock, FaKey, FaSave, FaTimes, FaCheck } from 'react-icons/fa'

const AdminChangePassword = () => {
  const { token, user } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword.length < 6) {
      toast.error(isArabic ? 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' : 'New password must be at least 6 characters')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(isArabic ? 'كلمة المرور غير متطابقة' : 'Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
      toast.success(t('Password changed successfully!', lang))
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to change password', lang))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout 
      title={t('Change Password', lang)} 
      subtitle={t('Update your password', lang)}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl border border-beige p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <FaLock className="text-3xl text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary-dark">
              {t('Change Password', lang)}
            </h3>
            <p className="text-sm text-muted">
              {t('Enter your current and new password', lang)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                {t('Current Password', lang)}
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder={t('Enter current password', lang)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                <FaKey className="inline mr-2 text-gold" />
                {t('New Password', lang)}
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder={t('Enter new password (min 6 characters)', lang)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                <FaCheck className="inline mr-2 text-primary" />
                {t('Confirm Password', lang)}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-beige rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder={t('Re-enter new password', lang)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaSave />
                {loading ? t('Saving...', lang) : t('Update', lang)}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1 bg-gray-100 text-text py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <FaTimes />
                {t('Cancel', lang)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminChangePassword