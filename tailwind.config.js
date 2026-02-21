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
          // ── Warm Bone palette ──────────────────
          charcoal:        '#1C1917',
          'charcoal-light':'#292524',
          'charcoal-muted':'#78716C',
          gold:            '#D4A853',
          'gold-light':    '#E8D5A3',
          'gold-xlight':   '#FBF7ED',
          bone:            '#FAF8F5',
          'bone-dark':     '#F0EBE3',
          warm:            '#E8E2D9',
          'warm-dark':     '#D6CFC4',
          // ── Functional ────────────────────────
          success:         '#68d391',
          error:           '#fc8181',
          'dark-gray':     '#2d3748',
          'medium-gray':   '#4a5568',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card':       '0 2px 8px 0 rgba(28,25,23,0.06), 0 1px 2px -1px rgba(28,25,23,0.04)',
        'card-hover': '0 8px 24px 0 rgba(28,25,23,0.10), 0 2px 4px -1px rgba(28,25,23,0.06)',
        'card-active':'0 0 0 2px rgba(212,168,83,0.45)',
        'toast':      '0 10px 40px -5px rgba(28,25,23,0.18), 0 4px 12px -2px rgba(28,25,23,0.10)',
        'tooltip':    '0 8px 24px -4px rgba(28,25,23,0.25)',
      },
      borderRadius: {
        'card': '16px',
      },
      animation: {
        'fade-in':        'fadeIn 0.25s ease-out',
        'fade-out':       'fadeOut 0.2s ease-in forwards',
        'slide-up':       'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-down':     'slideDown 0.25s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-out-right':'slideOutRight 0.25s ease-in forwards',
        'pulse-soft':     'pulseSoft 2s ease-in-out infinite',
        'spin-slow':      'spin 1.5s linear infinite',
        'bounce-in':      'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'shimmer':        'shimmer 1.8s ease-in-out infinite',
        'count-up':       'countUp 0.6s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeOut:      { '0%': { opacity: '1' }, '100%': { opacity: '0' } },
        slideUp:      { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown:    { '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideOutRight:{ '0%': { opacity: '1', transform: 'translateX(0)' }, '100%': { opacity: '0', transform: 'translateX(24px)' } },
        pulseSoft:    { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        bounceIn:     { '0%': { opacity: '0', transform: 'scale(0.85)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        countUp:      { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34,1.56,0.64,1)',
        'smooth': 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}
