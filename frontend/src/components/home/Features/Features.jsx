import React from 'react'
import { motion } from 'framer-motion'
import { Container } from '../../ui'
import { 
  FaCalendarCheck, FaMicrophone, FaBell, FaCertificate, 
  FaCreditCard, FaFolderOpen, FaCalendarAlt, FaChartLine 
} from 'react-icons/fa'

const Features = ({ lang }) => {
  const features = {
    en: [
      { icon: FaCalendarCheck, title: 'Daily Attendance', description: 'Precise attendance tracking per halaqah, with instant reports.' },
      { icon: FaMicrophone, title: 'Recitation Review', description: 'Track recitation and tajweed quality for every session.' },
      { icon: FaBell, title: 'Smart Notifications', description: 'Instant alerts for students and parents on what matters.' },
      { icon: FaCertificate, title: 'Certificates', description: 'Print verified certificates on completing each stage.' },
      { icon: FaCreditCard, title: 'Fee Management', description: 'Track monthly payments and due-date reminders.' },
      { icon: FaFolderOpen, title: 'Revision Files', description: 'Upload lessons and audio for students to review at home.' },
      { icon: FaCalendarAlt, title: 'Class Calendar', description: 'Schedule exams and events for each halaqah with ease.' },
      { icon: FaChartLine, title: 'Analytics', description: 'A full dashboard of the center\'s performance over time.' },
    ],
    ar: [
      { icon: FaCalendarCheck, title: 'الحضور اليومي', description: 'تسجيل دقيق للحضور والغياب لكل حلقة، بتقارير فورية.' },
      { icon: FaMicrophone, title: 'تقييم التلاوة', description: 'رصد جودة التلاوة والتجويد لكل جلسة مراجعة.' },
      { icon: FaBell, title: 'إشعارات ذكية', description: 'تنبيهات فورية للطالبات وأولياء الأمور بأهم المستجدات.' },
      { icon: FaCertificate, title: 'شهادات إنجاز', description: 'طباعة شهادات معتمدة عند إتمام كل مرحلة حفظ.' },
      { icon: FaCreditCard, title: 'إدارة الرسوم', description: 'متابعة المدفوعات الشهرية وتنبيهات الاستحقاق.' },
      { icon: FaFolderOpen, title: 'ملفات المراجعة', description: 'رفع دروس وتسجيلات صوتية لمراجعة الطالبات في المنزل.' },
      { icon: FaCalendarAlt, title: 'تقويم الحلقات', description: 'جدولة الاختبارات والفعاليات لكل حلقة بسهولة.' },
      { icon: FaChartLine, title: 'تحليلات ورسوم بيانية', description: 'لوحة مؤشرات شاملة لأداء المركز عبر الزمن.' },
    ]
  }

  const data = lang === 'ar' ? features.ar : features.en

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
            <span className="text-muted text-sm">
              {lang === 'ar' ? 'المميزات' : 'Features'}
            </span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold text-primary-dark ${lang === 'ar' ? 'font-arabic-display' : 'font-english-display'}`}>
            {lang === 'ar' ? 'أدوات تدعم كل خطوة' : 'Tools that support every step'}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 border border-beige hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-beige flex items-center justify-center mb-4">
                  <Icon className="text-2xl text-primary" />
                </div>
                <h5 className={`font-semibold text-primary-dark mb-2 ${lang === 'ar' ? 'font-arabic' : ''}`}>
                  {feature.title}
                </h5>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default Features