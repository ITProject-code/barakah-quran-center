import React from 'react'
import { Link } from 'react-router-dom'
import { FaQuran, FaHeart, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { useLanguage } from '../../context/LanguageContext'

const Footer = () => {
  const { isArabic } = useLanguage()

  const content = {
    en: {
      centerName: 'Barakah Women\'s Quran Center',
      address: 'Adama, Ganda Haraa, Ethiopia',
      description: 'Empowering women through Quran memorization and Islamic education since 2024.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Programs', path: '/programs' },
        { name: 'Admission', path: '/admission' },
        { name: 'Contact', path: '/contact' },
      ],
      contactInfo: {
        phone: '+251953104543',
        email: 'abdu0953104844@gmail.com',
      }
    },
    ar: {
      centerName: 'مركز بركة النسائية لتحفيظ القرآن الكريم',
      address: 'أداما، غندا هارا، إثيوبيا',
      description: 'تمكين النساء من خلال تحفيظ القرآن الكريم والتعليم الإسلامي منذ 2024.',
      quickLinks: 'روابط سريعة',
      contact: 'اتصل بنا',
      followUs: 'تابعونا',
      rights: 'جميع الحقوق محفوظة.',
      links: [
        { name: 'عن المركز', path: '/about' },
        { name: 'البرامج', path: '/programs' },
        { name: 'التسجيل', path: '/admission' },
        { name: 'اتصل بنا', path: '/contact' },
      ],
      contactInfo: {
        phone: '+251953104543',
        email: 'abdu0953104844@gmail.com',
      }
    }
  }

  const data = isArabic ? content.ar : content.en

  return (
    <footer className="bg-primary-dark text-ivory mt-auto">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                <FaQuran className="text-2xl text-gold" />
              </div>
              <div>
                <h3 className="font-english-display text-lg font-bold leading-tight">{data.centerName}</h3>
                <p className="text-ivory/60 text-sm font-arabic">{data.address}</p>
              </div>
            </div>
            <p className="text-ivory/70 text-sm leading-relaxed">
              {data.description}
            </p>
            <div className="flex gap-4 text-2xl">
              <FaFacebook className="text-ivory/50 hover:text-gold transition-colors cursor-pointer" />
              <FaInstagram className="text-ivory/50 hover:text-gold transition-colors cursor-pointer" />
              <FaTwitter className="text-ivory/50 hover:text-gold transition-colors cursor-pointer" />
              <FaYoutube className="text-ivory/50 hover:text-gold transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold">{data.quickLinks}</h4>
            <ul className="space-y-3">
              {data.links.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-ivory/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold">{data.contact}</h4>
            <ul className="space-y-4 text-sm">
              <li className="text-ivory/70 flex items-start gap-3">
                <FaPhone className="text-gold mt-0.5" />
                <div>
                  <span className="block text-ivory/50 text-xs">Phone</span>
                  <a href="tel:+251953104543" className="hover:text-gold transition-colors">
                    {data.contactInfo.phone}
                  </a>
                </div>
              </li>
              <li className="text-ivory/70 flex items-start gap-3">
                <FaEnvelope className="text-gold mt-0.5" />
                <div>
                  <span className="block text-ivory/50 text-xs">Email</span>
                  <a href="mailto:abdu0953104844@gmail.com" className="hover:text-gold transition-colors break-all">
                    {data.contactInfo.email}
                  </a>
                </div>
              </li>
              <li className="text-ivory/70 flex items-start gap-3">
                <FaMapMarkerAlt className="text-gold mt-0.5" />
                <div>
                  <span className="block text-ivory/50 text-xs">Address</span>
                  {data.address}
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold">Quick Info</h4>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li>📖 700+ Students</li>
              <li>👩‍🏫 42 Teachers</li>
              <li>📚 28 Halaqat</li>
              <li>🏆 12 Khitmah</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ivory/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ivory/50">
            © {new Date().getFullYear()} {data.centerName}. {data.rights}
          </p>
          <div className="flex items-center gap-2 text-sm text-ivory/50">
            <span>Made with</span>
            <FaHeart className="text-gold animate-pulse" />
            <span>for the love of Quran by Abdusalam Shamil | +251930586493</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer