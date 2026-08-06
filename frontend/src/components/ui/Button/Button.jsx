import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    gold: 'bg-gold text-primary-dark hover:bg-gold-light',
    ghost: 'border-2 border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white',
    outline: 'border-2 border-white/30 text-white hover:bg-white/10',
  }

  return (
    <button
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button