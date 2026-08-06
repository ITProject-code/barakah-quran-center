import React from 'react'
import { motion } from 'framer-motion'
import { Container } from '../../ui'
import { FaQuran } from 'react-icons/fa'

const BrandIdentity = ({ lang }) => {
  const content = {
    en: {
      badge: 'Brand Identity',
      title: 'A Mark and Palette Worthy of the Center',
      description: 'A calm, premium identity drawn from Islamic ornament, in emerald and gold on ivory.',
      colors: [
        { name: 'Emerald Green', hex: '#0F766E' },
        { name: 'Islamic Gold', hex: '#C9A227' },
        { name: 'Ivory White', hex: '#FAFAF7' },
        { name: 'Deep Forest', hex: '#163A2F' },
        { name: 'Soft Beige', hex: '#F4EFE6' },
      ]
    },
    ar: {
      badge: 'الهوية البصرية',
      title: 'شعار ولوحة ألوان تليق بالمركز',
      description: 'هوية هادئة وفاخرة، مستوحاة من الزخرفة الإسلامية، بألوان الزمرد والذهب على خلفية عاجية.',
      colors: [
        { name: 'أخضر زمردي', hex: '#0F766E' },
        { name: 'ذهبي إسلامي', hex: '#C9A227' },
        { name: 'عاجي', hex: '#FAFAF7' },
        { name: 'أخضر غامق', hex: '#163A2F' },
        { name: 'بيج فاتح', hex: '#F4EFE6' },
      ]
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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-beige px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-muted text-sm">{data.badge}</span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold text-primary-dark mb-4 ${lang === 'ar' ? 'font-arabic-display' : 'font-english-display'}`}>
            {data.title}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">{data.description}</p>
        </motion.div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="text-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-2xl border-4 border-gold/30">
                <div className="text-center">
                  <FaQuran className="text-6xl text-gold mx-auto mb-2" />
                  <div className="text-white text-sm font-arabic">﷽</div>
                  <div className="text-gold-light text-xs mt-1">Barakah Center</div>
                </div>
              </div>
              <p className="text-sm text-muted mt-4">
                {lang === 'ar' ? 'الشعار الرئيسي' : 'Primary Mark'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-xl border-2 border-gold/20">
                <div className="text-center">
                  <FaQuran className="text-4xl text-gold mx-auto mb-1" />
                  <div className="text-white text-xs font-arabic">﷽</div>
                </div>
              </div>
              <p className="text-sm text-muted mt-4">
                {lang === 'ar' ? 'نسخة مصغّرة' : 'Compact Mark'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {data.colors.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-40 rounded-xl overflow-hidden shadow-lg border border-beige"
              >
                <div 
                  className="h-20" 
                  style={{ 
                    backgroundColor: color.hex,
                    borderBottom: color.hex === '#FAFAF7' ? '1px solid #e5e7eb' : 'none'
                  }} 
                />
                <div className="bg-white p-3 text-center">
                  <div className="font-semibold text-sm text-primary-dark">{color.name}</div>
                  <div className="text-xs text-muted">{color.hex}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default BrandIdentity