import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Container } from '../../ui'

const QuranJourney = ({ lang }) => {
  const [completed] = useState(11)
  const total = 30
  const percentage = Math.round((completed / total) * 100)

  const content = {
    en: {
      badge: 'Signature Feature',
      title: 'The Quran Journey',
      description: 'Every student has her own visual path, showing her progress toward completing the Quran, one surah at a time.',
      subtitle: 'A ring of 30 parts, filling in gold as she progresses',
      paragraph: 'A circular ring represents the 30 juz. Each segment turns gold once her teacher confirms it — so every revision session shows visible progress, keeping her motivated all the way to a full completion.',
      completed: 'Confirmed',
      inProgress: 'In Progress',
      recent: 'Weekly Detail — Most Recent Surah Reviewed'
    },
    ar: {
      badge: 'الميزة المميزة',
      title: 'رحلة القرآن',
      description: 'كل طالبة لها مسار بصري خاص بها، يوضح تقدمها نحو ختم القرآن الكريم سورة بعد سورة.',
      subtitle: 'حلقة من 30 جزءًا، تتلون كلما تقدمتِ',
      paragraph: 'حلقة دائرية تمثل الثلاثين جزءًا، كل قطعة تتحول إلى اللون الذهبي فور اعتمادها من المعلمة، لتشعر الطالبة بأثر كل حصة مراجعة، وتبقى محفزة حتى تكتمل الحلقة بالكامل عند الختمة.',
      completed: 'جزء مكتمل',
      inProgress: 'جزء قيد الحفظ',
      recent: 'تفصيل أسبوعي — سور آخر جزء تمتّ مراجعته'
    }
  }

  const data = lang === 'ar' ? content.ar : content.en

  const renderMandala = () => {
    const segments = []
    const centerX = 160
    const centerY = 160
    const outerRadius = 145
    const innerRadius = 105
    const gapAngle = 2.4
    const anglePerSegment = 360 / total

    for (let i = 0; i < total; i++) {
      const startAngle = (i * anglePerSegment) + (gapAngle / 2) - 90
      const endAngle = ((i + 1) * anglePerSegment) - (gapAngle / 2) - 90
      
      const startRad = startAngle * Math.PI / 180
      const endRad = endAngle * Math.PI / 180

      const x1o = centerX + outerRadius * Math.cos(startRad)
      const y1o = centerY + outerRadius * Math.sin(startRad)
      const x2o = centerX + outerRadius * Math.cos(endRad)
      const y2o = centerY + outerRadius * Math.sin(endRad)
      const x1i = centerX + innerRadius * Math.cos(endRad)
      const y1i = centerY + innerRadius * Math.sin(endRad)
      const x2i = centerX + innerRadius * Math.cos(startRad)
      const y2i = centerY + innerRadius * Math.sin(startRad)

      const largeArc = anglePerSegment > 180 ? 1 : 0
      const isCompleted = i < completed

      segments.push(
        <path
          key={i}
          d={`M ${x1o} ${y1o} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x2i} ${y2i} Z`}
          fill={isCompleted ? '#C9A227' : '#E8E0D0'}
          stroke="#FAFAF7"
          strokeWidth="2"
          className="transition-colors duration-500"
        />
      )
    }

    return segments
  }

  const renderSurahTrack = () => {
    const surahs = []
    for (let i = 0; i < 20; i++) {
      surahs.push(
        <div
          key={i}
          className={`h-3 rounded-sm transition-colors duration-300 ${
            i < 12 ? 'bg-gold' : 'bg-beige'
          }`}
        />
      )
    }
    return surahs
  }

  return (
    <section className="py-20 bg-beige">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-ivory px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-muted text-sm">{data.badge}</span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold text-primary-dark mb-4 ${lang === 'ar' ? 'font-arabic-display' : 'font-english-display'}`}>
            {data.title}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">{data.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-80 h-80">
              <svg viewBox="0 0 320 320" className="w-full h-full">
                {renderMandala()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-ivory shadow-lg flex flex-col items-center justify-center border-2 border-gold/20">
                  <span className={`text-3xl font-bold text-primary ${lang === 'ar' ? 'font-arabic' : ''}`}>
                    {percentage}%
                  </span>
                  <span className="text-xs text-muted">
                    {lang === 'ar' ? 'من الحفظ' : 'Memorized'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div>
            <h3 className={`text-2xl font-bold text-primary-dark mb-4 ${lang === 'ar' ? 'font-arabic-display' : 'font-english-display'}`}>
              {data.subtitle}
            </h3>
            <p className="text-muted leading-relaxed mb-6">
              {data.paragraph}
            </p>

            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-gold" />
                <span className="text-sm text-text">{data.completed}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-beige border border-beige" />
                <span className="text-sm text-text">{data.inProgress}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted">{data.recent}</p>
              <div className="flex gap-1">
                {renderSurahTrack()}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default QuranJourney