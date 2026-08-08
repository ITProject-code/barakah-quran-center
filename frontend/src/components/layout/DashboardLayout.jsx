import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { 
  FaHome, FaUsers, FaChalkboardTeacher, FaBook, FaQuran, 
  FaCalendarCheck, FaMoneyBillWave,
  FaChartBar, FaCog, FaUserGraduate, FaUser,
  FaBell, FaEnvelope, FaSearch, FaMoon, FaSun,
  FaSignOutAlt, FaBars, FaTimes,
  FaKey, FaUserClock, FaFileAlt, FaWallet
} from 'react-icons/fa'

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth()
  const { lang, toggleLanguage, isArabic } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDark, setIsDark] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, isSidebarOpen])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  // Admin navigation
  const adminNav = [
    { icon: FaHome, label: 'Dashboard', labelAr: 'الرئيسية', path: '/admin/dashboard' },
    { icon: FaUsers, label: 'Users', labelAr: 'المستخدمين', path: '/admin/users' },
    { icon: FaChalkboardTeacher, label: 'Teachers', labelAr: 'المعلمات', path: '/admin/teachers' },
    { icon: FaUserGraduate, label: 'Students', labelAr: 'الطالبات', path: '/admin/students' },
    { icon: FaBook, label: 'Classes', labelAr: 'الحلقات', path: '/admin/classes' },
    { icon: FaCalendarCheck, label: 'Attendance', labelAr: 'الحضور', path: '/admin/attendance' },
    { icon: FaUserClock, label: 'Teacher Attendance', labelAr: 'حضور المعلمات', path: '/admin/teacher-attendance' },
    { icon: FaFileAlt, label: 'Teacher Reports', labelAr: 'تقارير المعلمات', path: '/admin/teacher-attendance/reports' },
    { icon: FaMoneyBillWave, label: 'Payments', labelAr: 'المدفوعات', path: '/admin/payments' },
    { icon: FaWallet, label: 'Class Payments', labelAr: 'مدفوعات الحلقة', path: '/admin/payments/class-view' },
    { icon: FaChartBar, label: 'Reports', labelAr: 'التقارير', path: '/admin/reports' },
    { icon: FaCog, label: 'Settings', labelAr: 'الإعدادات', path: '/admin/settings' },
    { icon: FaKey, label: 'Change Password', labelAr: 'تغيير كلمة المرور', path: '/admin/change-password' },
  ]

  // Teacher navigation
  const teacherNav = [
    { icon: FaHome, label: 'Dashboard', labelAr: 'الرئيسية', path: '/teacher/dashboard' },
    { icon: FaUserGraduate, label: 'My Students', labelAr: 'طالباتي', path: '/teacher/students' },
    { icon: FaCalendarCheck, label: 'Attendance', labelAr: 'الحضور', path: '/teacher/attendance' },
    { icon: FaQuran, label: 'Memorization', labelAr: 'الحفظ', path: '/teacher/memorization' },
    { icon: FaBook, label: 'Revision', labelAr: 'المراجعة', path: '/teacher/revision' },
    { icon: FaUser, label: 'Profile', labelAr: 'الملف الشخصي', path: '/teacher/profile' },
    { icon: FaCog, label: 'Settings', labelAr: 'الإعدادات', path: '/teacher/settings' },
    { icon: FaKey, label: 'Change Password', labelAr: 'تغيير كلمة المرور', path: '/change-password' },
  ]

  const currentNav = user?.role === 'admin' ? adminNav : teacherNav

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const getLabel = (item) => isArabic ? item.labelAr : item.label

  // RTL support - sidebar slides from right in Arabic
  const sidebarTranslate = isArabic ? 'translate-x-full' : '-translate-x-full'
  const sidebarOpenTranslate = isArabic ? '-translate-x-0' : 'translate-x-0'

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-[#0a0f0d]' : 'bg-beige'}`}>
      {/* ============================================================ */}
      {/* OVERLAY - Only visible on mobile when sidebar is open */}
      {/* ============================================================ */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={closeSidebar}
          style={{ backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* ============================================================ */}
      {/* SIDEBAR - FIXED: Now stretches full height on desktop */}
      {/* ============================================================ */}
      <div 
        className={`
          ${isMobile ? 'fixed' : 'relative'}
          inset-y-0 ${isArabic ? 'right-0' : 'left-0'}
          z-50
          w-64
          bg-primary-dark text-beige
          min-h-screen
          overflow-y-auto
          flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${isMobile ? (
            isSidebarOpen ? sidebarOpenTranslate : sidebarTranslate
          ) : 'translate-x-0'}
          lg:block
        `}
        style={{
          direction: isArabic ? 'rtl' : 'ltr'
        }}
      >
        {/* Sidebar Inner Container - flex column to push logout to bottom */}
        <div className="flex flex-col min-h-screen">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-beige/10 flex items-center justify-between sticky top-0 bg-primary-dark z-10">
            <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <FaQuran className="text-gold text-xl" />
              </div>
              <div className={isArabic ? 'text-right' : 'text-left'}>
                <div className="font-arabic text-sm font-bold">بركة النسائية</div>
                <div className="text-xs text-gold/70">{isArabic ? 'نظام الإدارة' : 'Management'}</div>
              </div>
            </div>
            {isMobile && (
              <button 
                onClick={closeSidebar} 
                className="text-beige/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <FaTimes className="text-xl" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-beige/10">
            <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-primary-dark font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
                <div className="text-sm font-medium truncate">{user?.name}</div>
                <div className="text-xs text-beige/50 capitalize">
                  {isArabic ? (user?.role === 'admin' ? 'مدير النظام' : 'معلمة') : user?.role}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation - Fills available space */}
          <nav className="flex-1 p-3 pb-4 overflow-y-auto">
            <div className={`text-xs text-beige/30 uppercase tracking-wider px-3 py-2 ${isArabic ? 'text-right' : 'text-left'}`}>
              {isArabic ? 'لوحة التحكم' : 'Navigation'}
            </div>
            
            {currentNav.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.path)

              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path)
                    closeSidebar()
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 mb-0.5 ${
                    active 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-beige/70 hover:bg-beige/10 hover:text-white'
                  } ${isArabic ? 'flex-row-reverse justify-end' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : ''}`} />
                  <span>{getLabel(item)}</span>
                  {active && (
                    <span className={`ml-auto w-1.5 h-1.5 rounded-full bg-gold ${isArabic ? 'ml-0 mr-auto' : ''}`} />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Logout Button - Pushed to bottom */}
          <div className="p-4 border-t border-beige/10 bg-primary-dark flex-shrink-0">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-beige/50 hover:bg-beige/10 hover:text-white transition-colors ${isArabic ? 'flex-row-reverse justify-end' : ''}`}
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>{isArabic ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTENT - Always takes full width */}
      {/* ============================================================ */}
      <div className="flex-1 min-w-0 w-full">
        {/* Top Bar */}
        <div className={`sticky top-0 z-30 ${isDark ? 'bg-[#0a0f0d]/90 border-white/5' : 'bg-ivory/90 border-beige'} backdrop-blur-md border-b px-4 sm:px-6 py-3 flex items-center justify-between`}>
          <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
            {/* Hamburger button - only visible on mobile */}
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors lg:hidden ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-beige/30'
              }`}
              aria-label="Toggle Sidebar"
            >
              <FaBars className={`text-xl ${isDark ? 'text-white' : 'text-primary-dark'}`} />
            </button>

            <div className={isArabic ? 'text-right' : 'text-left'}>
              <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-primary-dark'}`}>{title}</h1>
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-muted'}`}>{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <FaSearch className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-muted'} text-sm`} />
              <input
                type="text"
                placeholder={isArabic ? 'بحث سريع...' : 'Quick search...'}
                className={`pl-9 pr-4 py-2 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-white border-beige text-text'} border rounded-lg text-sm focus:outline-none focus:border-primary w-32 sm:w-48 ${isArabic ? 'text-right pr-9 pl-4' : ''}`}
              />
            </div>

            <button className={`relative p-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-beige'} border rounded-lg hover:bg-beige/30 transition-colors`}>
              <FaBell className={isDark ? 'text-white/50' : 'text-muted'} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">5</span>
            </button>

            <button className={`p-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-beige'} border rounded-lg hover:bg-beige/30 transition-colors hidden sm:block`}>
              <FaEnvelope className={isDark ? 'text-white/50' : 'text-muted'} />
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-beige'} border rounded-lg hover:bg-beige/30 transition-colors`}
            >
              {isDark ? <FaSun className="text-gold" /> : <FaMoon className="text-muted" />}
            </button>

            <button
              onClick={toggleLanguage}
              className={`px-3 sm:px-4 py-1.5 rounded-lg font-medium transition-colors ${
                isArabic 
                  ? 'bg-primary-dark text-white hover:bg-primary-dark/80' 
                  : 'bg-gold text-primary-dark hover:bg-gold-light'
              }`}
            >
              {isArabic ? 'English' : 'عربي'}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className={`p-4 sm:p-6 ${isDark ? 'bg-[#0a0f0d]' : 'bg-beige'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout