import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaCheckCircle, FaQuran, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../utils/translate'
import api from '../utils/api'

const ResetPassword = () => {
  const { token } = useParams()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [validToken, setValidToken] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      setVerifying(true)
      const response = await api.get(`/auth/verify-reset-token/${token}`)
      if (response.data.success) {
        setValidToken(true)
        toast.success(t('Token is valid. Please enter your new password.', lang))
      }
    } catch (error) {
      const message = error.response?.data?.message || t('Invalid or expired token', lang)
      toast.error(message)
      setValidToken(false)
    } finally {
      setVerifying(false)
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
    
    if (formData.newPassword.length < 6) {
      toast.error(t('Password must be at least 6 characters', lang))
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t('Passwords do not match', lang))
      return
    }

    setResetting(true)
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })
      
      if (response.data.success) {
        toast.success(t('Password reset successfully! Please login.', lang))
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (error) {
      const message = error.response?.data?.message || t('Failed to reset password', lang)
      toast.error(message)
    } finally {
      setResetting(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary/80 py-12 px-4 relative overflow-hidden">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">{t('Verifying your token...', lang)}</p>
        </div>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary/80 py-12 px-4 relative overflow-hidden">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white">{t('Invalid or Expired Link', lang)}</h1>
          <p className="text-white/70 mt-2 text-sm">
            {t('The password reset link is invalid or has expired.', lang)}
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block bg-gold text-primary-dark px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-light transition-colors"
          >
            {t('Request New Link', lang)}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary/80 py-12 px-4 relative overflow-hidden">
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center shadow-2xl shadow-primary/30 border-4 border-gold/30 relative">
                <FaLock className="text-4xl text-gold" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-white font-english-display">
              {t('Reset Password', lang)}
            </h1>
            <p className="text-white/70 mt-2 text-sm">
              {t('Enter your new password below', lang)}
            </p>
            <div className="w-20 h-1 bg-gold mx-auto mt-4 rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <FaLock className="inline mr-2" />
                {t('New Password', lang)}
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                  placeholder={t('Enter new password (min 6 characters)', lang)}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <FaCheckCircle className="inline mr-2" />
                {t('Confirm Password', lang)}
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                  placeholder={t('Confirm your new password', lang)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={resetting}
              className="relative w-full bg-gradient-to-r from-gold to-gold-light text-primary-dark py-3.5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              <span className="relative z-10">
                {resetting ? t('Resetting...', lang) : t('Reset Password', lang)}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-white/60 hover:text-white transition-colors text-sm flex items-center justify-center gap-2"
              >
                <FaArrowLeft className="text-xs" />
                {t('Back to Login', lang)}
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword