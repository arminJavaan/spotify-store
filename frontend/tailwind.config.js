/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1db954',
        dark1: '#212121',
        dark2: '#121212',
        gray1: '#535353',
        gray2: '#b3b3b3'
      },
      fontFamily: {
        vazir: ['Vazir', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-in-out',
        slideIn: 'slideIn 0.6s ease-in-out'
      }
    }
  },
  plugins: [],
}
