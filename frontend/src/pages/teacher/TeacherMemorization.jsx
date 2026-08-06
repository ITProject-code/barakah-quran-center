import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { t } from '../../utils/translate'
import { FaQuran } from 'react-icons/fa'

const TeacherMemorization = () => {
  const { lang } = useLanguage()
  return (
    <DashboardLayout title={t('Record Memorization', lang)} subtitle={t('Track student memorization progress', lang)}>
      <div className="bg-white rounded-xl p-12 text-center border border-beige">
        <FaQuran className="text-6xl text-muted/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary-dark">{t('Coming soon...', lang)}</h3>
        <p className="text-muted mt-2">{t('This feature is being developed', lang)}</p>
      </div>
    </DashboardLayout>
  )
}

export default TeacherMemorization