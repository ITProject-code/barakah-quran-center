import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaQuran } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../utils/translate'
import api from '../utils/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resetLink, setResetLink] = useState('')
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error(t('Please enter your email address', lang))
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/forgot-password', { email })
      
      if (response.data.success) {
        setSent(true)
        setResetLink(response.data.resetLink)
        toast.success(t('Reset link sent to your email!', lang))
      }
    } catch (error) {
      const message = error.response?.data?.message || t('Failed to send reset link', lang)
      toast.error(message)
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center shadow-2xl shadow-primary/30 border-4 border-gold/30 relative">
                <FaQuran className="text-4xl text-gold" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-white font-english-display">
              {t('Forgot Password', lang)}
            </h1>
            <p className="text-white/70 mt-2 text-sm">
              {t('Enter your email and we\'ll send you a reset link', lang)}
            </p>
            <div className="w-20 h-1 bg-gold mx-auto mt-4 rounded-full" />
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  <FaEnvelope className="inline mr-2" />
                  {t('Email Address', lang)}
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-primary/20 rounded-xl blur group-focus-within:blur-md transition-all duration-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="relative w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-gold to-gold-light text-primary-dark py-3.5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? t('Sending...', lang) : t('Send Reset Link', lang)}
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
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <FaCheckCircle className="text-6xl text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t('Check Your Email', lang)}</h2>
              <p className="text-white/70 text-sm">
                {t('We\'ve sent a password reset link to', lang)} <strong className="text-gold-light">{email}</strong>
              </p>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-xs">
                  {t('For testing purposes, your reset link is:', lang)}
                </p>
                <p className="text-gold-light text-sm break-all mt-1">{resetLink}</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="text-gold hover:text-gold-light transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
              >
                <FaArrowLeft className="text-xs" />
                {t('Back to Login', lang)}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword