import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import TeacherLogin from './pages/TeacherLogin'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import Users from './pages/admin/Users'
import Teachers from './pages/admin/Teachers'
import TeacherProfile from './pages/admin/TeacherProfile'
import Students from './pages/admin/Students'
import AddStudent from './pages/admin/AddStudent'
import StudentProfile from './pages/admin/StudentProfile'
import EditStudent from './pages/admin/EditStudent'
import Classes from './pages/admin/Classes'
import ClassDetails from './pages/admin/ClassDetails'
import AttendanceToday from './pages/admin/AttendanceToday'
import AttendanceReports from './pages/admin/AttendanceReports'
import Payments from './pages/admin/Payments'
import AddPayment from './pages/admin/AddPayment'
import PaymentDetails from './pages/admin/PaymentDetails'
import EditPayment from './pages/admin/EditPayment'
import PaymentReports from './pages/admin/PaymentReports'
import ClassPayments from './pages/admin/ClassPayments'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'
import AdminChangePassword from './pages/admin/AdminChangePassword'
import AdminTeacherAttendance from './pages/admin/TeacherAttendance'
import AdminTeacherAttendanceReports from './pages/admin/TeacherAttendanceReports'
import ChangePassword from './pages/ChangePassword'
import ProtectedRoute from './components/ProtectedRoute'
import TeacherStudents from './pages/teacher/TeacherStudents'
import TeacherStudentProfile from './pages/teacher/TeacherStudentProfile'
import TeacherAttendance from './pages/teacher/TeacherAttendance'
import TeacherAttendanceReports from './pages/teacher/TeacherAttendanceReports'
import TeacherMemorization from './pages/teacher/TeacherMemorization'
import TeacherRevision from './pages/teacher/TeacherRevision'
import TeacherProfilePage from './pages/teacher/TeacherProfile'
import TeacherSettings from './pages/teacher/Settings'

// Public Pages
import About from './pages/public/About'
import Programs from './pages/public/Programs'
import TeachersPublic from './pages/public/Teachers'
import Gallery from './pages/public/Gallery'
import Admission from './pages/public/Admission'
import Announcements from './pages/public/Announcements'
import Contact from './pages/public/Contact'

import { useAuth } from './context/AuthContext'

// Component to update page title based on route
const PageTitleUpdater = () => {
  const location = useLocation()
  const { isArabic } = useLanguage()
  
  const titles = {
    en: {
      '/': 'Home | Barakah Women\'s Quran Center',
      '/about': 'About | Barakah Women\'s Quran Center',
      '/programs': 'Programs | Barakah Women\'s Quran Center',
      '/teachers': 'Teachers | Barakah Women\'s Quran Center',
      '/gallery': 'Gallery | Barakah Women\'s Quran Center',
      '/admission': 'Admission | Barakah Women\'s Quran Center',
      '/announcements': 'Announcements | Barakah Women\'s Quran Center',
      '/contact': 'Contact | Barakah Women\'s Quran Center',
      '/login': 'Login | Barakah Women\'s Quran Center',
      '/admin-login': 'Admin Login | Barakah Women\'s Quran Center',
      '/teacher-login': 'Teacher Login | Barakah Women\'s Quran Center',
      '/forgot-password': 'Forgot Password | Barakah Women\'s Quran Center',
      '/reset-password': 'Reset Password | Barakah Women\'s Quran Center',
      '/admin/dashboard': 'Admin Dashboard | Barakah Women\'s Quran Center',
      '/teacher/dashboard': 'Teacher Dashboard | Barakah Women\'s Quran Center',
      '/admin/users': 'Users Management | Barakah Women\'s Quran Center',
      '/admin/teachers': 'Teachers Management | Barakah Women\'s Quran Center',
      '/admin/students': 'Students Management | Barakah Women\'s Quran Center',
      '/admin/classes': 'Classes Management | Barakah Women\'s Quran Center',
      '/admin/attendance': 'Attendance | Barakah Women\'s Quran Center',
      '/admin/attendance/reports': 'Attendance Reports | Barakah Women\'s Quran Center',
      '/admin/payments': 'Payments | Barakah Women\'s Quran Center',
      '/admin/payments/reports': 'Payment Reports | Barakah Women\'s Quran Center',
      '/admin/payments/class-view': 'Class Payments | Barakah Women\'s Quran Center',
      '/admin/reports': 'Reports | Barakah Women\'s Quran Center',
      '/admin/settings': 'Settings | Barakah Women\'s Quran Center',
      '/admin/change-password': 'Change Password | Barakah Women\'s Quran Center',
      '/admin/teacher-attendance': 'Teacher Attendance | Barakah Women\'s Quran Center',
      '/admin/teacher-attendance/reports': 'Teacher Reports | Barakah Women\'s Quran Center',
      '/teacher/students': 'My Students | Barakah Women\'s Quran Center',
      '/teacher/attendance': 'Attendance | Barakah Women\'s Quran Center',
      '/teacher/attendance/reports': 'Attendance Reports | Barakah Women\'s Quran Center',
      '/teacher/memorization': 'Memorization | Barakah Women\'s Quran Center',
      '/teacher/revision': 'Revision | Barakah Women\'s Quran Center',
      '/teacher/profile': 'My Profile | Barakah Women\'s Quran Center',
      '/teacher/settings': 'Teacher Settings | Barakah Women\'s Quran Center',
    },
    ar: {
      '/': 'الرئيسية | مركز بركة النسائية لتحفيظ القرآن',
      '/about': 'عن المركز | مركز بركة النسائية لتحفيظ القرآن',
      '/programs': 'البرامج | مركز بركة النسائية لتحفيظ القرآن',
      '/teachers': 'المعلمات | مركز بركة النسائية لتحفيظ القرآن',
      '/gallery': 'المعرض | مركز بركة النسائية لتحفيظ القرآن',
      '/admission': 'التسجيل | مركز بركة النسائية لتحفيظ القرآن',
      '/announcements': 'الإعلانات | مركز بركة النسائية لتحفيظ القرآن',
      '/contact': 'اتصل بنا | مركز بركة النسائية لتحفيظ القرآن',
      '/login': 'تسجيل الدخول | مركز بركة النسائية لتحفيظ القرآن',
      '/admin-login': 'تسجيل الدخول للمدير | مركز بركة النسائية لتحفيظ القرآن',
      '/teacher-login': 'تسجيل الدخول للمعلمة | مركز بركة النسائية لتحفيظ القرآن',
      '/forgot-password': 'نسيت كلمة المرور | مركز بركة النسائية لتحفيظ القرآن',
      '/reset-password': 'إعادة تعيين كلمة المرور | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/dashboard': 'لوحة تحكم المدير | مركز بركة النسائية لتحفيظ القرآن',
      '/teacher/dashboard': 'لوحة تحكم المعلمة | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/users': 'إدارة المستخدمين | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/teachers': 'إدارة المعلمات | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/students': 'إدارة الطالبات | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/classes': 'إدارة الحلقات | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/attendance': 'الحضور | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/attendance/reports': 'تقارير الحضور | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/payments': 'المدفوعات | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/payments/reports': 'تقارير المدفوعات | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/payments/class-view': 'مدفوعات الحلقة | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/reports': 'التقارير | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/settings': 'الإعدادات | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/change-password': 'تغيير كلمة المرور | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/teacher-attendance': 'حضور المعلمات | مركز بركة النسائية لتحفيظ القرآن',
      '/admin/teacher-attendance/reports': 'تقارير المعلمات | مركز بركة النسائية لتحفيظ القرآن',
      '/teacher/students': 'طالباتي | مركز بركة النسائية لتحفيظ القرآن',
      '/teacher/attendance': 'الحضور | مركز بركة النسائية لتحفيظ القرآن',
      '/teacher/attendance/reports': 'تقارير الحضور | مركز بركة النسائية لتحفيظ القرآن',
      '/teacher/memorization': 'الحفظ | مركز بركة النسائية لتحفيظ القرآن',
      '/teacher/revision': 'المراجعة | مركز بركة النسائية لتحفيظ القرآن',
      '/teacher/profile': 'ملفي الشخصي | مركز بركة النسائية لتحفيظ القرآن',
      '/teacher/settings': 'إعدادات المعلمة | مركز بركة النسائية لتحفيظ القرآن',
    }
  }

  useEffect(() => {
    const currentPath = location.pathname
    const titleMap = isArabic ? titles.ar : titles.en
    
    let title = titleMap[currentPath]
    
    if (!title) {
      for (const [path, value] of Object.entries(titleMap)) {
        if (currentPath.startsWith(path) && path !== '/') {
          title = value
          break
        }
      }
    }
    
    document.title = title || (isArabic ? 'مركز بركة النسائية لتحفيظ القرآن' : 'Barakah Women\'s Quran Center')
  }, [location, isArabic])

  return null
}

// Wrapper component to access auth inside route
const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <>
      <PageTitleUpdater />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/teachers" element={<TeachersPublic />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Change Password */}
        <Route path="/change-password" element={<ChangePassword />} />

        {/* ============================================ */}
        {/* PROTECTED ROUTES - ADMIN ONLY */}
        {/* ============================================ */}
        
        <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><Users /></ProtectedRoute>} />
        <Route path="/admin/teachers" element={<ProtectedRoute requiredRole="admin"><Teachers /></ProtectedRoute>} />
        <Route path="/admin/teachers/:id" element={<ProtectedRoute requiredRole="admin"><TeacherProfile /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute requiredRole="admin"><Students /></ProtectedRoute>} />
        <Route path="/admin/students/add" element={<ProtectedRoute requiredRole="admin"><AddStudent /></ProtectedRoute>} />
        <Route path="/admin/students/:id" element={<ProtectedRoute requiredRole="admin"><StudentProfile /></ProtectedRoute>} />
        <Route path="/admin/students/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditStudent /></ProtectedRoute>} />
        <Route path="/admin/classes" element={<ProtectedRoute requiredRole="admin"><Classes /></ProtectedRoute>} />
        <Route path="/admin/classes/:id" element={<ProtectedRoute requiredRole="admin"><ClassDetails /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute requiredRole="admin"><AttendanceToday /></ProtectedRoute>} />
        <Route path="/admin/attendance/reports" element={<ProtectedRoute requiredRole="admin"><AttendanceReports /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute requiredRole="admin"><Payments /></ProtectedRoute>} />
        <Route path="/admin/payments/reports" element={<ProtectedRoute requiredRole="admin"><PaymentReports /></ProtectedRoute>} />
        <Route path="/admin/payments/add" element={<ProtectedRoute requiredRole="admin"><AddPayment /></ProtectedRoute>} />
        <Route path="/admin/payments/:id" element={<ProtectedRoute requiredRole="admin"><PaymentDetails /></ProtectedRoute>} />
        <Route path="/admin/payments/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditPayment /></ProtectedRoute>} />
        <Route path="/admin/payments/class-view" element={<ProtectedRoute requiredRole="admin"><ClassPayments /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><Reports /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
        <Route path="/admin/change-password" element={<ProtectedRoute requiredRole="admin"><AdminChangePassword /></ProtectedRoute>} />
        <Route path="/admin/teacher-attendance" element={<ProtectedRoute requiredRole="admin"><AdminTeacherAttendance /></ProtectedRoute>} />
        <Route path="/admin/teacher-attendance/reports" element={<ProtectedRoute requiredRole="admin"><AdminTeacherAttendanceReports /></ProtectedRoute>} />

        {/* ============================================ */}
        {/* PROTECTED ROUTES - TEACHER ONLY */}
        {/* ============================================ */}
        
        <Route path="/teacher/dashboard" element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/students" element={<ProtectedRoute requiredRole="teacher"><TeacherStudents /></ProtectedRoute>} />
        <Route path="/teacher/students/:id" element={<ProtectedRoute requiredRole="teacher"><TeacherStudentProfile /></ProtectedRoute>} />
        <Route path="/teacher/attendance" element={<ProtectedRoute requiredRole="teacher"><TeacherAttendance /></ProtectedRoute>} />
        <Route path="/teacher/attendance/reports" element={<ProtectedRoute requiredRole="teacher"><TeacherAttendanceReports /></ProtectedRoute>} />
        <Route path="/teacher/memorization" element={<ProtectedRoute requiredRole="teacher"><TeacherMemorization /></ProtectedRoute>} />
        <Route path="/teacher/revision" element={<ProtectedRoute requiredRole="teacher"><TeacherRevision /></ProtectedRoute>} />
        <Route path="/teacher/profile" element={<ProtectedRoute requiredRole="teacher"><TeacherProfilePage /></ProtectedRoute>} />
        <Route path="/teacher/settings" element={<ProtectedRoute requiredRole="teacher"><TeacherSettings /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FAFAF7',
                color: '#1C2E28',
                border: '1px solid #E0C065',
                borderRadius: '12px',
              },
            }}
          />
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App