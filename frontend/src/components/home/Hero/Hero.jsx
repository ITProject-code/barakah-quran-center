import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Container, Button } from '../../ui'
import { FaQuran, FaStar, FaBookOpen } from 'react-icons/fa'

const Hero = ({ lang }) => {
  const navigate = useNavigate()

  const content = {
    en: {
      badge: 'Adama, Ganda Haraa',
      title: 'Disciplined Memorization,',
      titleHighlight: 'Guided with Care',
      description: 'A complete management system for a women\'s Quran memorization center — built for over 700 students, their teachers, and their families.',
      ctaPrimary: 'Register Now',
      ctaSecondary: 'Sign In',
      stats: [
        { value: '700+', label: 'Students Enrolled' },
        { value: '42', label: 'Teachers' },
        { value: '28', label: 'Halaqat' },
        { value: '12', label: 'Completions' },
      ]
    },
    ar: {
      badge: 'أداما، غندا هارا',
      title: 'حفظ متقن،',
      titleHighlight: 'ومتابعة تليق بمسيرتها مع القرآن',
      description: 'نظام إداري متكامل لمركز تحفيظ نسائي، يجمع بين رقي التجربة وسهولة الاستخدام، لأكثر من 700 طالبة ومعلماتهن وأولياء أمورهن.',
      ctaPrimary: 'سجلي الآن',
      ctaSecondary: 'دخول النظام',
      stats: [
        { value: '٧٠٠+', label: 'طالبة مسجلة' },
        { value: '٤٢', label: 'معلمة' },
        { value: '٢٨', label: 'حلقة تحفيظ' },
        { value: '١٢', label: 'ختمة كاملة' },
      ]
    }
  }

  const data = lang === 'ar' ? content.ar : content.en

  const handleSignIn = () => {
    navigate('/login')
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary/80">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl font-arabic">﷽</div>
        <div className="absolute bottom-10 right-10 text-8xl font-arabic">﷽</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-white/5" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-white/80 text-sm">{data.badge}</span>
            </div>

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 ${lang === 'ar' ? 'font-arabic-display' : 'font-english-display'}`}>
              {data.title}
              <span className="block text-gold-light mt-2">{data.titleHighlight}</span>
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              {data.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              {/* Register Now Button - DISABLED / Visual only */}
              <button
                className="bg-gray-400/70 text-white/60 px-8 py-3.5 rounded-lg font-bold text-lg cursor-not-allowed opacity-70 relative z-10"
                disabled
                style={{ pointerEvents: 'none' }}
              >
                {data.ctaPrimary}
              </button>
              
              {/* Sign In Button - WORKING */}
              <button
                onClick={handleSignIn}
                className="bg-gold text-primary-dark px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-gold-light transition-all duration-300 hover:shadow-2xl hover:shadow-gold/30 transform hover:-translate-y-1 cursor-pointer relative z-10"
              >
                {data.ctaSecondary}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-2xl md:text-3xl font-bold text-gold-light ${lang === 'ar' ? 'font-arabic' : ''}`}>
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-spin-slow" />
              <div className="absolute inset-8 rounded-full border-2 border-gold/10 animate-spin-slower" />
              <div className="absolute inset-16 rounded-full border-2 border-white/10 animate-spin-slow" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary-dark to-primary shadow-2xl flex items-center justify-center border-4 border-gold/30">
                  <div className="text-center">
                    <FaQuran className="text-5xl md:text-6xl text-gold mx-auto mb-2" />
                    <div className="text-white text-sm font-arabic">﷽</div>
                    <div className="text-white/60 text-xs mt-1">Barakah Center</div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <FaStar className="text-gold" />
                  <div>
                    <div className="text-sm font-bold text-primary-dark">92%</div>
                    <div className="text-xs text-muted">Attendance</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <FaBookOpen className="text-primary" />
                  <div>
                    <div className="text-sm font-bold text-primary-dark">Surah Al-Kahf</div>
                    <div className="text-xs text-muted">Latest Revision</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export default Hero