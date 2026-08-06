import React from 'react'
import { Container } from '../../ui'
import { FaUsers, FaChalkboardTeacher, FaBook, FaCertificate } from 'react-icons/fa'

const Stats = ({ lang }) => {
  const stats = {
    en: [
      { icon: FaUsers, value: '700+', label: 'Students' },
      { icon: FaChalkboardTeacher, value: '42', label: 'Teachers' },
      { icon: FaBook, value: '28', label: 'Classes' },
      { icon: FaCertificate, value: '12', label: 'Completions' },
    ],
    ar: [
      { icon: FaUsers, value: '٧٠٠+', label: 'طالبة' },
      { icon: FaChalkboardTeacher, value: '٤٢', label: 'معلمة' },
      { icon: FaBook, value: '٢٨', label: 'حلقة' },
      { icon: FaCertificate, value: '١٢', label: 'ختمة' },
    ]
  }

  const data = lang === 'ar' ? stats.ar : stats.en

  return (
    <section className="py-16 bg-primary-dark">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <Icon className="text-4xl text-gold mx-auto mb-3" />
                <div className={`text-3xl md:text-4xl font-bold text-gold-light ${lang === 'ar' ? 'font-arabic' : ''}`}>
                  {stat.value}
                </div>
                <div className="text-ivory/70 text-sm">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default Stats