/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: '#002244',
          950: '#001A36',
          800: '#003060',
          700: '#0A3D75',
        },
        sky: {
          brand: '#2571BC',
          light: '#8ECAE6',
        },
        sun: {
          300: '#FFC94D',
          400: '#FFC107',
          500: '#FFB703',
          600: '#E5A503',
        },
      },
      boxShadow: {
        'glow-sun': '0 0 24px rgba(255, 183, 3, 0.18)',
        'glow-soft': '0 8px 32px rgba(0, 10, 30, 0.5)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'pop': 'pop 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
