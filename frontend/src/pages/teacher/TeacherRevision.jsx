import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { FaBook } from 'react-icons/fa'

const TeacherRevision = () => {
  const { lang } = useLanguage()
  return (
    <DashboardLayout title={t('Record Revision', lang)} subtitle={t('Track student revision progress', lang)}>
      <div className="bg-white rounded-xl p-12 text-center border border-beige">
        <FaBook className="text-6xl text-muted/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary-dark">{t('Coming soon...', lang)}</h3>
        <p className="text-muted mt-2">{t('This feature is being developed', lang)}</p>
      </div>
    </DashboardLayout>
  )
}

export default TeacherRevision