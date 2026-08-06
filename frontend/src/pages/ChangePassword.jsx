import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaKey, FaCheck } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../utils/translate'
import api from '../utils/api'

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, token, logout } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (newPassword.length < 6) {
      toast.error(t('Password must be at least 6 characters', lang))
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('Passwords do not match', lang))
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      })
      
      toast.success(t('Password changed successfully! Please login with your new password.', lang))
      
      logout()
      navigate('/login')
      
    } catch (error) {
      toast.error(error.response?.data?.message || t('Failed to change password', lang))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary/80 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl font-arabic">﷽</div>
        <div className="absolute bottom-10 right-10 text-9xl font-arabic">﷽</div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex justify-center mb-4"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center shadow-2xl shadow-primary/30 border-4 border-gold/30 relative">
                <FaKey className="text-4xl text-gold" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full"
                />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-white font-english-display">
              {t('Change Password', lang)}
            </h1>
            <p className="text-white/70 mt-2">
              {t('Please change your default password to continue', lang)}
            </p>
            <div className="w-20 h-1 bg-gold mx-auto mt-4 rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <FaLock className="inline mr-2" />
                {t('Current Password', lang)}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                  placeholder={t('Enter default password', lang)}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <FaKey className="inline mr-2" />
                {t('New Password', lang)}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                  placeholder={t('Enter new password (min 6 characters)', lang)}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <FaCheck className="inline mr-2" />
                {t('Confirm New Password', lang)}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                  placeholder={t('Confirm your new password', lang)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold to-gold-light text-primary-dark py-3.5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-primary-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('Updating...', lang)}
                </span>
              ) : (
                t('Change Password & Continue', lang)
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/30 text-xs">
              {t('Barakah Women\'s Quran Center', lang)} © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ChangePassword