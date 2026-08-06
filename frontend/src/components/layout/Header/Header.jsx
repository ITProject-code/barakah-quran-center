import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { Container, LanguageToggle, Logo } from '../../ui'
import { useAuth } from '../../../context/AuthContext'
import { useLanguage } from '../../../context/LanguageContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isArabic, toggleLanguage } = useLanguage()

  const navLinks = {
    en: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Programs', path: '/programs' },
      { name: 'Teachers', path: '/teachers' },
      { name: 'Gallery', path: '/gallery' },
      { name: 'Announcements', path: '/announcements' },
      { name: 'Admissions', path: '/admissions' },
      { name: 'Contact', path: '/contact' },
    ],
    ar: [
      { name: 'الرئيسية', path: '/' },
      { name: 'عن المركز', path: '/about' },
      { name: 'البرامج', path: '/programs' },
      { name: 'المعلمات', path: '/teachers' },
      { name: 'المعرض', path: '/gallery' },
      { name: 'الإعلانات', path: '/announcements' },
      { name: 'التسجيل', path: '/admissions' },
      { name: 'اتصل بنا', path: '/contact' },
    ]
  }

  const currentLinks = isArabic ? navLinks.ar : navLinks.en

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard'
    if (user?.role === 'teacher') return '/teacher/dashboard'
    return '/'
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-beige sticky top-0 z-50">
      <Container>
        <nav className="py-4 flex justify-between items-center">
          <Logo />

          <div className="hidden lg:flex items-center gap-8">
            {currentLinks.map((link) => (
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

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
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
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to={getDashboardPath()}
                  className="hidden sm:inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  <FaUser className="text-xs" />
                  <span className="hidden md:inline">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-2 text-muted hover:text-red-500 transition-colors text-sm"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-sm font-medium"
              >
                {isArabic ? 'دخول' : 'Sign In'}
              </button>
            )}

            <button 
              className="lg:hidden text-2xl text-primary hover:text-gold transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-beige">
            <div className="flex flex-col gap-3">
              {currentLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-text hover:text-primary transition-colors py-2 px-4 hover:bg-beige/50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link 
                    to={getDashboardPath()}
                    className="text-primary py-2 px-4 hover:bg-beige/50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="text-red-500 py-2 px-4 hover:bg-red-50 rounded-lg text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    navigate('/login')
                    setIsMenuOpen(false)
                  }}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-center mt-2"
                >
                  {isArabic ? 'دخول' : 'Sign In'}
                </button>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header