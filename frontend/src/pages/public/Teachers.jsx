import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { FaUser, FaStar, FaBook } from 'react-icons/fa'

const Teachers = () => {
  const { isArabic } = useLanguage()

  const teachers = [
    { name: 'Rawan Sharafadin', specialtyEn: 'Quran Recitation', specialtyAr: 'تلاوة' },
    { name: 'Badriya Ali', specialtyEn: 'Quran Recitation', specialtyAr: 'تلاوة القرآن' },
    { name: 'Munawara Mahmud', specialtyEn: 'Quran Recitation', specialtyAr: 'تلاوة' },
    { name: 'Asma Sultan', specialtyEn: ' Memorization', specialtyAr: 'حفظ' },
    { name: 'Hajar Shamil Ahmed', specialtyEn: 'Advanced Memorization', specialtyAr: 'حفظ متقدم' },
    { name: 'Lammi Ibrahim', specialtyEn: 'Qaidah al Nourania', specialtyAr: 'القاعدة النورانیة' },
    { name: 'Makida Daato', specialtyEn: 'Quran Recitation', specialtyAr: 'تلاوة' },
    { name: 'Tamema Jaylan', specialtyEn: 'Quran Recitation', specialtyAr: 'تلاوة' },
  ]

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className={`text-3xl md:text-4xl font-bold text-primary-dark mb-4 ${isArabic ? 'font-arabic' : 'font-english'}`}>
            {isArabic ? 'معلماتنا' : 'Our Teachers'}
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto" />
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            {isArabic
              ? 'معلمات مؤهلات وذوات خبرة في تعليم القرآن الكريم.'
              : 'Qualified and experienced teachers in Quranic education.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-beige text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-3xl text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary-dark">{teacher.name}</h3>
              <p className="text-sm text-muted">{isArabic ? teacher.specialtyAr : teacher.specialtyEn}</p>
              <div className="flex justify-center gap-1 mt-2 text-gold">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Teachers