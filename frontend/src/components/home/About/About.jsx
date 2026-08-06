import React from 'react'
import { motion } from 'framer-motion'
import { Container } from '../../ui'

const About = ({ lang }) => {
  const content = {
    en: {
      badge: 'About The Center',
      title: 'A Calm Setting for Lasting Memorization',
      description: 'Barakah Women\'s Quran Memorization Center in Adama is a dedicated in-person institution for women and girls, pairing sound pedagogy with a digital system built for a center of its scale.'
    },
    ar: {
      badge: 'عن المركز',
      title: 'بيئة هادئة لحفظ راسخ',
      description: 'مركز بركة النسائية لتحفيظ القرآن الكريم في أداما هو صرح تعليمي حضوري متخصص بتحفيظ القرآن للنساء والفتيات، يجمع بين المنهجية التربوية المتينة، ونظام إداري رقمي يواكب احتياجات مركز بحجمه.'
    }
  }

  const data = lang === 'ar' ? content.ar : content.en

  return (
    <section className="py-20 bg-ivory">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 bg-beige px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-muted text-sm">{data.badge}</span>
          </div>

          <h2 className={`text-3xl md:text-4xl font-bold text-primary-dark mb-6 ${lang === 'ar' ? 'font-arabic-display' : 'font-english-display'}`}>
            {data.title}
          </h2>

          <div className="w-24 h-1 bg-gold mx-auto mb-8" />

          <p className="text-lg text-muted leading-relaxed">
            {data.description}
          </p>
        </motion.div>
      </Container>
    </section>
  )
}

export default About