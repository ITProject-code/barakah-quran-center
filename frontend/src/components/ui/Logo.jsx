import React from 'react'
import { Link } from 'react-router-dom'
import { FaQuran } from 'react-icons/fa'

const Logo = ({ variant = 'full', className = '' }) => {
  if (variant === 'compact') {
    return (
      <Link to="/" className={`flex items-center gap-2 ${className}`}>
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
            <FaQuran className="text-2xl text-gold" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse" />
        </div>
      </Link>
    )
  }

  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
          <FaQuran className="text-3xl text-gold group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse" />
      </div>
      
      <div className="flex flex-col leading-tight">
        <span className="font-english-display text-xl font-bold text-primary-dark group-hover:text-gold transition-colors duration-300">
          Barakah Center
        </span>
        <span className="font-arabic text-sm text-gold">
          مركز بركة النسائية
        </span>
      </div>
    </Link>
  )
}

export default Logo