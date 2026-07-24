/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0B0E',
        charcoal: '#14161C',
        'amber-sizzle': '#FF9E00',
        'crimson-cyber': '#FF3B30',
        'gold-burma': '#E6B800',
        'cream-warm': '#FAF6F0',
        'mint-neon': '#10B981',
        'street-white': '#FFFFFF',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      backgroundImage: {
        'amber-radial': 'radial-gradient(ellipse at center, rgba(255,158,0,0.15) 0%, transparent 70%)',
        'crimson-radial': 'radial-gradient(ellipse at center, rgba(255,59,48,0.12) 0%, transparent 70%)',
        'hero-vignette': 'radial-gradient(ellipse at center, transparent 20%, rgba(10,11,14,0.8) 100%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
      },
      boxShadow: {
        amber: '0 0 20px rgba(255,158,0,0.4), 0 0 60px rgba(255,158,0,0.15)',
        crimson: '0 0 20px rgba(255,59,48,0.4), 0 0 60px rgba(255,59,48,0.15)',
        mint: '0 0 15px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.2)',
        gold: '0 0 20px rgba(230,184,0,0.4)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,158,0,0.15)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.4)',
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'marquee-rev': 'marquee-rev 35s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-up': 'fade-up 0.6s ease forwards',
        flicker: 'flicker 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.75', filter: 'brightness(1.3)' },
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.4' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.6' },
          '97%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
