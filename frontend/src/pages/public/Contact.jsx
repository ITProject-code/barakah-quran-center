import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const Contact = () => {
  const { isArabic } = useLanguage()
  
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige">
          <h1 className={`text-3xl md:text-4xl font-bold text-primary-dark mb-4 ${isArabic ? 'font-arabic' : 'font-english'}`}>
            {isArabic ? 'اتصل بنا' : 'Contact Us'}
          </h1>
          <div className="w-20 h-1 bg-gold mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center p-6 bg-beige/30 rounded-xl">
              <FaPhone className="text-3xl text-primary mx-auto mb-3" />
              <p className="font-semibold">{isArabic ? 'الهاتف' : 'Phone'}</p>
              <p className="text-muted">+251 953 104 543</p>
            </div>
            <div className="text-center p-6 bg-beige/30 rounded-xl">
              <FaEnvelope className="text-3xl text-primary mx-auto mb-3" />
              <p className="font-semibold">{isArabic ? 'البريد الإلكتروني' : 'Email'}</p>
              <p className="text-muted">abdu0953104844@gmail.com</p>
            </div>
            <div className="text-center p-6 bg-beige/30 rounded-xl">
              <FaMapMarkerAlt className="text-3xl text-primary mx-auto mb-3" />
              <p className="font-semibold">{isArabic ? 'العنوان' : 'Address'}</p>
              <p className="text-muted">{isArabic ? 'أداما، غندا هارا، إثيوبيا' : 'Adama, Ganda Haraa, Ethiopia'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact