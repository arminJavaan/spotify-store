// frontend/tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        dark1: '#212121',
        dark2: '#121212',
        'gray-med': '#535353',
        'gray-light': '#B3B3B3',
      },
      fontFamily: {
        vazir: ['Vazir', 'sans-serif']
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px'
      }
    },
  },
  plugins: [],
}
