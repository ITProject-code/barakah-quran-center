import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaQuran, FaEnvelope, FaLock, FaUserShield, FaChalkboardTeacher,
  FaMoon, FaSun, FaArrowRight
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { t } from '../utils/translate'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { login, user } = useAuth()
  const { lang, isArabic } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (user.role === 'teacher') {
        navigate('/teacher/dashboard')
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(email, password)
    
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (result.user.role === 'teacher') {
        navigate('/teacher/dashboard')
      }
    }
    setLoading(false)
  }

  const demoAccounts = [
    { 
      role: isArabic ? 'مدير' : 'Admin', 
      email: 'admin@barakah.com', 
      password: 'admin123',
      icon: FaUserShield,
      color: 'text-gold'
    },
    { 
      role: isArabic ? 'معلمة' : 'Teacher', 
      email: 'teacher@barakah.com', 
      password: 'teacher123',
      icon: FaChalkboardTeacher,
      color: 'text-primary'
    }
  ]

  const fillDemo = (email, password) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0a0f0d] via-[#0a1a14] to-[#06100c]' 
        : 'bg-gradient-to-br from-primary-dark via-primary to-primary/90'
    } py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl font-arabic">﷽</div>
        <div className="absolute bottom-10 right-10 text-9xl font-arabic">﷽</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-2 border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-white/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-1">
              <FaArrowRight className="text-xs" />
              {t('Home', lang)}
            </Link>
            <button onClick={() => setIsDark(!isDark)} className="text-white/60 hover:text-white transition-colors text-xl">
              {isDark ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex justify-center mb-4"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center shadow-2xl shadow-primary/30 border-4 border-gold/30 relative">
                <FaQuran className="text-5xl text-gold" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full"
                />
              </div>
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-white font-english-display">
              {t('Welcome Back', lang)}
            </h1>
            <p className="text-white/70 mt-2 font-arabic text-lg">
              {t('Sign in to your account', lang)}
            </p>
            <div className="w-20 h-1 bg-gold mx-auto mt-4 rounded-full" />
          </div>

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

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <FaLock className="inline mr-2" />
                {t('Password', lang)}
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-primary/20 rounded-xl blur group-focus-within:blur-md transition-all duration-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="relative w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/30 bg-white/5 text-gold focus:ring-gold focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-white/60">
                  {t('Remember me', lang)}
                </span>
              </label>
              <Link to="/forgot-password" className="text-sm text-gold hover:text-gold-light transition-colors">
                {t('Forgot password?', lang)}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-gradient-to-r from-gold to-gold-light text-primary-dark py-3.5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-primary-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('Signing In...', lang)}
                  </span>
                ) : (
                  t('Sign In', lang)
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/50 text-xs mb-4">
              {t('Quick Demo Access', lang)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {demoAccounts.map((account, index) => {
                const Icon = account.icon
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fillDemo(account.email, account.password)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-center transition-all duration-300 group"
                  >
                    <Icon className={`text-2xl ${account.color} mx-auto mb-1 group-hover:scale-110 transition-transform`} />
                    <div className="text-white/80 text-xs font-medium">{account.role}</div>
                    <div className="text-white/30 text-[10px] truncate">{account.email}</div>
                  </motion.button>
                )
              })}
            </div>
          </div>

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

export default Login