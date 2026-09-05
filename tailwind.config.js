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
          950: '#111214', // V2.1 Midnight Cinema background
          900: '#15161A', // V2.1 Card background
          850: '#1C1E24', // Secondary surface
          800: '#242730', // Elevated border/surface
          750: '#2E323D',
          text: '#F5F5F7',
          muted: '#9A9CA2',
          accent: '#FF9F1C', // Amber Orange
          emerald: '#10B981',
          amber: '#F59E0B',
          slate: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans TC', 'sans-serif'],
      },
      boxShadow: {
        'glow-accent': '0 0 20px -5px rgba(255, 159, 28, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
