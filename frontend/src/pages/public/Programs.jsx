import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { FaQuran, FaBook, FaStar, FaCertificate } from 'react-icons/fa'

const Programs = () => {
  const { isArabic } = useLanguage()

  const programs = [
    { 
      icon: FaQuran, 
      titleEn: 'Quran Memorization', 
      titleAr: 'تحفيظ القرآن',
      descEn: 'Complete memorization of the Holy Quran with certified teachers.',
      descAr: 'حفظ كامل للقرآن الكريم مع معلمات معتمدات.'
    },
    { 
      icon: FaBook, 
      titleEn: 'Revision Program', 
      titleAr: 'برنامج المراجعة',
      descEn: 'Systematic revision to strengthen and perfect memorization.',
      descAr: 'مراجعة منهجية لتقوية وإتقان الحفظ.'
    },
    { 
      icon: FaStar, 
      titleEn: 'Tajweed & Recitation', 
      titleAr: 'التجويد والتلاوة',
      descEn: 'Perfect your recitation with proper tajweed rules.',
      descAr: 'أتقن تلاوتك مع قواعد التجويد الصحيحة.'
    },
    { 
      icon: FaCertificate, 
      titleEn: 'Ijazah Program', 
      titleAr: 'برنامج الإجازة',
      descEn: 'Obtain certified ijazah in Quran recitation and memorization.',
      descAr: 'احصل على إجازة معتمدة في تلاوة وحفظ القرآن الكريم.'
    },
  ]

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className={`text-3xl md:text-4xl font-bold text-primary-dark mb-4 ${isArabic ? 'font-arabic' : 'font-english'}`}>
            {isArabic ? 'برامجنا' : 'Our Programs'}
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto" />
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            {isArabic
              ? 'نقدم مجموعة متنوعة من البرامج القرآنية المصممة لتلبية احتياجات كل طالبة.'
              : 'We offer a variety of Quranic programs designed to meet the needs of every student.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => {
            const Icon = program.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-beige hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="text-2xl text-primary" />
                </div>
                <h3 className={`text-lg font-semibold text-primary-dark mb-2 ${isArabic ? 'font-arabic' : ''}`}>
                  {isArabic ? program.titleAr : program.titleEn}
                </h3>
                <p className="text-sm text-muted">
                  {isArabic ? program.descAr : program.descEn}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Programs