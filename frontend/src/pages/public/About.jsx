import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

const About = () => {
  const { isArabic } = useLanguage()

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-beige">
          <h1 className={`text-3xl md:text-4xl font-bold text-primary-dark mb-6 ${isArabic ? 'font-arabic' : 'font-english'}`}>
            {isArabic ? 'عن المركز' : 'About Us'}
          </h1>
          <div className="w-20 h-1 bg-gold mb-6" />
          
          <div className="prose max-w-none text-muted leading-relaxed space-y-4">
            <p>
              {isArabic 
                ? 'مركز بركة النسائية لتحفيظ القرآن الكريم هو مؤسسة تعليمية إسلامية مخصصة لتحفيظ القرآن الكريم للنساء والفتيات في أداما، إثيوبيا.'
                : 'Barakah Women\'s Quran Memorization Center is an Islamic educational institution dedicated to Quran memorization for women and girls in Adama, Ethiopia.'}
            </p>
            <p>
              {isArabic
                ? 'تأسس المركز بهدف تمكين النساء من خلال حفظ القرآن الكريم وفهمه وتطبيقه في حياتهن اليومية.'
                : 'The center was established to empower women through the memorization, understanding, and application of the Holy Quran in their daily lives.'}
            </p>
            <p>
              {isArabic
                ? 'يضم المركز أكثر من ٧٠٠ طالبة و ٤٢ معلمة مؤهلة، ويقدم برامج متنوعة في التحفيظ والمراجعة والتجويد.'
                : 'The center has over 700 students and 42 qualified teachers, offering diverse programs in memorization, revision, and tajweed.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <h3 className={`font-semibold text-primary-dark mb-2 ${isArabic ? 'font-arabic' : ''}`}>
                {isArabic ? 'رؤيتنا' : 'Our Vision'}
              </h3>
              <p className="text-sm text-muted">
                {isArabic
                  ? 'أن نكون مركزاً رائداً لتحفيظ القرآن الكريم للنساء في إثيوبيا والقرن الأفريقي.'
                  : 'To be a leading center for Quran memorization for women in Ethiopia and the Horn of Africa.'}
              </p>
            </div>
            <div className="bg-gold/5 rounded-xl p-6 border border-gold/10">
              <h3 className={`font-semibold text-primary-dark mb-2 ${isArabic ? 'font-arabic' : ''}`}>
                {isArabic ? 'رسالتنا' : 'Our Mission'}
              </h3>
              <p className="text-sm text-muted">
                {isArabic
                  ? 'تقديم تعليم قرآني متميز يجمع بين الحفظ المتقن والفهم العميق والتطبيق العملي.'
                  : 'To provide distinguished Quranic education that combines precise memorization, deep understanding, and practical application.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About