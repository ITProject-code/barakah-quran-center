import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaQuran, FaBars, FaTimes } from 'react-icons/fa'
import { useLanguage } from '../../context/LanguageContext'

const Navbar = () => {
  const { isArabic, toggleLanguage } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = {
    en: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Programs', path: '/programs' },
      { name: 'Teachers', path: '/teachers' },
      { name: 'Gallery', path: '/gallery' },
      { name: 'Admission', path: '/admission' },
      { name: 'Announcements', path: '/announcements' },
      { name: 'Contact', path: '/contact' },
    ],
    ar: [
      { name: 'الرئيسية', path: '/' },
      { name: 'عن المركز', path: '/about' },
      { name: 'البرامج', path: '/programs' },
      { name: 'المعلمات', path: '/teachers' },
      { name: 'المعرض', path: '/gallery' },
      { name: 'التسجيل', path: '/admission' },
      { name: 'الإعلانات', path: '/announcements' },
      { name: 'اتصل بنا', path: '/contact' },
    ]
  }

  const links = isArabic ? navLinks.ar : navLinks.en

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-beige sticky top-0 z-50">
      <div className="container-custom py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <FaQuran className="text-2xl text-gold" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-english text-xl font-bold text-primary-dark group-hover:text-gold transition-colors">
              {isArabic ? 'مركز بركة النسائي' : 'Barakah Women\'s Quran Center'}
            </span>
            <span className="font-arabic text-sm text-gold">
              {isArabic ? 'لتحفيظ القرآن' : 'Quran Center'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-text hover:text-primary transition-colors duration-300 text-sm font-medium relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Right Side - FIXED z-index for Sign In button */}
        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={toggleLanguage}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors text-sm ${
              isArabic 
                ? 'bg-primary-dark text-white hover:bg-primary-dark/80' 
                : 'bg-gold text-primary-dark hover:bg-gold-light'
            }`}
          >
            {isArabic ? 'English' : 'عربي'}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="hidden sm:inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-sm font-medium cursor-pointer relative z-20"
          >
            {isArabic ? 'دخول' : 'Sign In'}
          </button>

          <button
            className="lg:hidden text-2xl text-primary hover:text-gold transition-colors relative z-20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden py-4 border-t border-beige bg-white relative z-50">
          <div className="container-custom flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-text hover:text-primary transition-colors py-2 px-4 hover:bg-beige/50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                navigate('/login')
                setIsMenuOpen(false)
              }}
              className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-center mt-2 cursor-pointer"
            >
              {isArabic ? 'دخول' : 'Sign In'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar