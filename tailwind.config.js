/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mpj: {
          purple: '#76527c',
          'purple-dark': '#5c3f62',
          'purple-light': '#9a7a9f',
          'purple-xlight': '#f3eef4',
          green: '#d8ee91',
          'green-dark': '#b8d45a',
          teal: '#D0E4E7',
          'teal-dark': '#a8c8cd',
          accent: '#9f7aea',
          success: '#68d391',
          error: '#fc8181',
          'dark-gray': '#2d3748',
          'medium-gray': '#4a5568',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(118,82,124,0.12), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'card-active': '0 0 0 2px rgba(118,82,124,0.3)',
        'toast': '0 10px 40px -5px rgba(0,0,0,0.18), 0 4px 12px -2px rgba(0,0,0,0.1)',
        'tooltip': '0 8px 24px -4px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        'card': '14px',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-out-right': 'slideOutRight 0.25s ease-in forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'count-up': 'countUp 0.6s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(24px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34,1.56,0.64,1)',
        'smooth': 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}
