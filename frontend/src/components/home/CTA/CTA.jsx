import React from 'react'
import { motion } from 'framer-motion'
import { Container, Button } from '../../ui'

const CTA = ({ lang }) => {
  const content = {
    en: {
      title: 'Begin Her Quran Journey Today',
      description: 'Join over 700 students in an organized, motivating path of memorization.',
      ctaPrimary: 'Register Now',
      ctaSecondary: 'Sign In'
    },
    ar: {
      title: 'ابدئي رحلتك مع القرآن اليوم',
      description: 'انضمّي إلى أكثر من 700 طالبة في مسيرة حفظ منظمة ومحفزة.',
      ctaPrimary: 'سجلي الآن',
      ctaSecondary: 'دخول النظام'
    }
  }

  const data = lang === 'ar' ? content.ar : content.en

  return (
    <section className="py-20 bg-ivory">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-primary-dark rounded-3xl p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-8xl font-arabic">﷽</div>
            <div className="absolute bottom-10 right-10 text-8xl font-arabic">﷽</div>
          </div>

          <div className="relative z-10">
            <h2 className={`text-3xl md:text-4xl font-bold text-ivory mb-4 ${lang === 'ar' ? 'font-arabic-display' : 'font-english-display'}`}>
              {data.title}
            </h2>
            <p className="text-ivory/70 text-lg mb-8 max-w-2xl mx-auto">
              {data.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" className="text-lg px-8 py-3.5">
                {data.ctaPrimary}
              </Button>
              <button className="border-2 border-ivory/30 text-ivory px-8 py-3.5 rounded-lg hover:bg-ivory/10 transition-all duration-300 text-lg font-semibold">
                {data.ctaSecondary}
              </button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default CTA