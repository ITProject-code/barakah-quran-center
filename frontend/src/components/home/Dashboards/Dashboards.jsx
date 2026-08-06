import React from 'react'
import { motion } from 'framer-motion'
import { Container } from '../../ui'
import { FaUserGraduate, FaChalkboardTeacher, FaBuilding, FaCheckCircle } from 'react-icons/fa'

const Dashboards = ({ lang }) => {
  const content = {
    en: {
      badge: 'Full Management System',
      title: 'A Dashboard for Every Role',
      description: 'A tailored experience for students, teachers, and administrators — each sees exactly what matters to them.',
      dashboards: [
        {
          icon: FaUserGraduate,
          role: 'Student Dashboard',
          title: 'Her Personal Path',
          features: ['Memorization progress & journey', 'Attendance', 'Teacher comments', 'Weekly goals', 'Monthly report & certificates', 'Payment status']
        },
        {
          icon: FaChalkboardTeacher,
          role: 'Teacher Dashboard',
          title: 'Running the Halaqah',
          features: ['Student list', 'Attendance', 'Daily memorization records', 'Revision records', 'Exams', 'Messages to parents']
        },
        {
          icon: FaBuilding,
          role: 'Admin Dashboard',
          title: 'The Whole Center, at a Glance',
          features: ['Students & teachers', 'Payments', 'Reports & analytics', 'Announcements', 'Classes (halaqat)', 'Certificates']
        }
      ]
    },
    ar: {
      badge: 'نظام إداري كامل',
      title: 'لوحة لكل دور',
      description: 'تجربة مصممة خصيصًا للطالبة، والمعلمة، والإدارة — كل واحدة ترى ما يخصها فقط.',
      dashboards: [
        {
          icon: FaUserGraduate,
          role: 'لوحة الطالبة',
          title: 'مسار الحفظ الشخصي',
          features: ['تقدّم الحفظ والرحلة القرآنية', 'الحضور والغياب', 'ملاحظات المعلمة', 'الأهداف الأسبوعية', 'التقرير الشهري والشهادات', 'حالة الرسوم الشهرية']
        },
        {
          icon: FaChalkboardTeacher,
          role: 'لوحة المعلمة',
          title: 'إدارة الحلقة اليومية',
          features: ['قائمة الطالبات', 'تسجيل الحضور', 'سجل الحفظ اليومي', 'سجل المراجعة والتلاوة', 'الاختبارات والتقييم', 'رسائل لأولياء الأمور']
        },
        {
          icon: FaBuilding,
          role: 'لوحة الإدارة',
          title: 'نظرة شاملة على المركز',
          features: ['الطالبات والمعلمات', 'المدفوعات والرسوم', 'التقارير والتحليلات', 'الإعلانات', 'إدارة الحلقات', 'إصدار الشهادات']
        }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.dashboards.map((dashboard, index) => {
            const Icon = dashboard.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-beige/50"
              >
                <div className={`w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ${index === 1 ? 'bg-gold/10' : ''} ${index === 2 ? 'bg-primary-dark/10' : ''}`}>
                  <Icon className={`text-2xl ${index === 0 ? 'text-primary' : index === 1 ? 'text-gold' : 'text-primary-dark'}`} />
                </div>
                
                <span className="text-xs text-gold font-semibold uppercase tracking-wider">
                  {dashboard.role}
                </span>
                <h4 className={`text-xl font-bold text-primary-dark mb-4 ${lang === 'ar' ? 'font-arabic' : ''}`}>
                  {dashboard.title}
                </h4>

                <ul className="space-y-2">
                  {dashboard.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted">
                      <FaCheckCircle className="text-gold text-xs mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default Dashboards