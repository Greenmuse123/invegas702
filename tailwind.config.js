/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E50914', // Netflix-style red
          dark: '#B2070F',
          light: '#FF1A1A',
        },
        secondary: {
          DEFAULT: '#121212', // Dark background
          light: '#1E1E1E',
          dark: '#0A0A0A',
        },
        accent: {
          DEFAULT: '#F5F5F5', // Light text
          dark: '#CCCCCC',
        },
        gray: {
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(229, 9, 20, 0.5)',
        'glow-lg': '0 0 30px rgba(229, 9, 20, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-medium': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(10px)' },
          '50%': { transform: 'translateY(0) translateX(20px)' },
          '75%': { transform: 'translateY(10px) translateX(10px)' },
        },
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      perspective: {
        'DEFAULT': '1000px',
      },
      rotate: {
        'y-25': 'rotateY(25deg)',
        'y-[-25deg]': 'rotateY(-25deg)',
      },
      translate: {
        'z-0': 'translateZ(0px)',
        'z-1': 'translateZ(1px)',
        'z-2': 'translateZ(2px)',
        'z-3': 'translateZ(3px)',
        'z-4': 'translateZ(4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.perspective': {
          perspective: '1000px',
        },
        '.rotate-y-25': {
          transform: 'rotateY(25deg)',
        },
        '.rotate-y-\\[-25deg\\]': {
          transform: 'rotateY(-25deg)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}