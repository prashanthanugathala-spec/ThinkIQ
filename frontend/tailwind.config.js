/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#000000',
          card: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          blue: '#0071e3',
          purple: '#af52de',
          green: '#34c759',
          orange: '#ff9500',
        },
        google: {
          blue: '#1a73e8',
          red: '#ea4335',
          yellow: '#fbbc04',
          green: '#34a853',
          surface: '#1e1f22',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'apple-hover': '0 12px 40px 0 rgba(56, 189, 248, 0.15)',
        'glow-blue': '0 0 25px rgba(56, 189, 248, 0.3)',
      },
      backdropBlur: {
        '2xl': '40px',
      }
    },
  },
  plugins: [],
}
