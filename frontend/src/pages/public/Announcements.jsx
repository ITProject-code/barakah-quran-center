import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

const Announcements = () => {
  const { isArabic } = useLanguage()
  
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige text-center">
          <h1 className={`text-3xl md:text-4xl font-bold text-primary-dark mb-4 ${isArabic ? 'font-arabic' : 'font-english'}`}>
            {isArabic ? 'الإعلانات' : 'Announcements'}
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto mb-6" />
          <p className="text-muted">{isArabic ? 'الإعلانات والتحديثات قريباً...' : 'Announcements and updates coming soon...'}</p>
        </div>
      </div>
    </div>
  )
}

export default Announcements