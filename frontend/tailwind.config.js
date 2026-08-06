/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F766E',
        'primary-dark': '#163A2F',
        gold: '#C9A227',
        'gold-light': '#E0C065',
        ivory: '#FAFAF7',
        beige: '#F4EFE6',
        text: '#1C2E28',
        muted: '#5C6E68',
      },
      fontFamily: {
        arabic: ['"Amiri"', '"Noto Naskh Arabic"', 'serif'],
        arabicDisplay: ['"Cairo"', '"Amiri"', 'sans-serif'],
        english: ['"Inter"', 'sans-serif'],
        englishDisplay: ['"Cormorant Garamond"', '"Inter"', 'serif'],
      },
    },
  },
  plugins: [],
}