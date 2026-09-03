/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lightBg1: '#e0f7fa',
        lightBg2: '#b2ebf2',
        lightBg3: '#e1f5fe',
        lightText: '#006064',
        lightBtn: '#00838f',
        lightBtnHover: '#006064',
        darkBg1: '#001219',
        darkBg2: '#00212e',
        darkBg3: '#005f73',
        darkText: '#94d2bd',
        darkBtn: '#00afb9',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}