export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#07090e',
          900: '#0c101a',
          850: '#121726',
          800: '#192136',
          750: '#212c47',
          700: '#2b395b',
          600: '#3e5281',
          500: '#5c74ad',
          accent: '#f59e0b',
          neon: '#6366f1',
          crimson: '#f43f5e',
          cyan: '#06b6d4',
          emerald: '#10b981',
          gold: '#fbbf24'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans TC', 'sans-serif'],
      },
      boxShadow: {
        'glow-accent': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-neon': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-crimson': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
