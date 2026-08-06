import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { FaCog, FaUser, FaBell, FaShieldAlt } from 'react-icons/fa'

const TeacherSettings = () => {
  const { isArabic } = useLanguage()
  
  return (
    <DashboardLayout 
      title={isArabic ? 'إعدادات المعلمة' : 'Teacher Settings'} 
      subtitle={isArabic ? 'إدارة إعدادات حساب المعلمة' : 'Manage teacher account settings'}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl p-6 border border-beige hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FaUser className="text-xl text-primary" />
            </div>
            <h2 className="text-lg font-bold text-primary-dark">
              {isArabic ? 'إعدادات الملف الشخصي' : 'Profile Settings'}
            </h2>
          </div>
          <p className="text-sm text-muted mb-4">
            {isArabic ? 'تحديث معلومات الملف الشخصي للمعلمة' : 'Update teacher profile information'}
          </p>
          <button className="text-primary hover:underline text-sm">
            {isArabic ? 'تعديل الملف الشخصي →' : 'Edit Profile →'}
          </button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 border border-beige hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <FaBell className="text-xl text-gold" />
            </div>
            <h2 className="text-lg font-bold text-primary-dark">
              {isArabic ? 'إعدادات الإشعارات' : 'Notification Settings'}
            </h2>
          </div>
          <p className="text-sm text-muted mb-4">
            {isArabic ? 'إدارة إعدادات الإشعارات والتنبيهات' : 'Manage notification and alert settings'}
          </p>
          <button className="text-primary hover:underline text-sm">
            {isArabic ? 'تعديل الإشعارات →' : 'Edit Notifications →'}
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-6 border border-beige hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FaShieldAlt className="text-xl text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-primary-dark">
              {isArabic ? 'إعدادات الأمان' : 'Security Settings'}
            </h2>
          </div>
          <p className="text-sm text-muted mb-4">
            {isArabic ? 'إدارة كلمة المرور وإعدادات الأمان' : 'Manage password and security settings'}
          </p>
          <button 
            onClick={() => window.location.href = '/change-password'}
            className="text-primary hover:underline text-sm"
          >
            {isArabic ? 'تغيير كلمة المرور →' : 'Change Password →'}
          </button>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl p-6 border border-beige hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center">
              <FaCog className="text-xl text-primary-dark" />
            </div>
            <h2 className="text-lg font-bold text-primary-dark">
              {isArabic ? 'التفضيلات' : 'Preferences'}
            </h2>
          </div>
          <p className="text-sm text-muted mb-4">
            {isArabic ? 'إدارة تفضيلات المعلمة والإعدادات العامة' : 'Manage teacher preferences and general settings'}
          </p>
          <button className="text-primary hover:underline text-sm">
            {isArabic ? 'تعديل التفضيلات →' : 'Edit Preferences →'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TeacherSettings