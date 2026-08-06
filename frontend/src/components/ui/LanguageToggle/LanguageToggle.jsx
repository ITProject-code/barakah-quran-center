import React from 'react'

const LanguageToggle = ({ currentLang, onToggle }) => {
  return (
    <div className="flex border border-primary-dark/10 rounded-full overflow-hidden text-sm">
      <button
        className={`px-4 py-1.5 transition-colors ${
          currentLang === 'ar' 
            ? 'bg-primary-dark text-ivory' 
            : 'bg-transparent text-muted hover:bg-primary-dark/5'
        }`}
        onClick={() => onToggle('ar')}
      >
        عربي
      </button>
      <button
        className={`px-4 py-1.5 transition-colors ${
          currentLang === 'en' 
            ? 'bg-primary-dark text-ivory' 
            : 'bg-transparent text-muted hover:bg-primary-dark/5'
        }`}
        onClick={() => onToggle('en')}
      >
        EN
      </button>
    </div>
  )
}

export default LanguageToggle