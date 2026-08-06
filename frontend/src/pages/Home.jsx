import React from 'react'
import { 
  Hero, 
  Stats, 
  About, 
  QuranJourney, 
  Dashboards, 
  Features, 
  BrandIdentity, 
  CTA 
} from '../components/home'
import { useLanguage } from '../context/LanguageContext'

const Home = () => {
  const { isArabic } = useLanguage()

  return (
    <div>
      {/* Hero Section - Big banner at the top */}
      <Hero lang={isArabic ? 'ar' : 'en'} />
      
      {/* Stats Section - Shows numbers like 700+ Students */}
      <Stats lang={isArabic ? 'ar' : 'en'} />
      
      {/* About Section - Information about the center */}
      <About lang={isArabic ? 'ar' : 'en'} />
      
      {/* Quran Journey - 30 Juz progress ring */}
      <QuranJourney lang={isArabic ? 'ar' : 'en'} />
      
      {/* Dashboards - Preview of Admin and Teacher dashboards */}
      <Dashboards lang={isArabic ? 'ar' : 'en'} />
      
      {/* Features - All features like Daily Memorization, etc. */}
      <Features lang={isArabic ? 'ar' : 'en'} />
      
      {/* Brand Identity - Logo and color palette */}
      <BrandIdentity lang={isArabic ? 'ar' : 'en'} />
      
      {/* CTA - Call to action (Begin Your Quran Journey Today) */}
      <CTA lang={isArabic ? 'ar' : 'en'} />
    </div>
  )
}

export default Home