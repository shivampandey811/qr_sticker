/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080808',
        gold: { 50: '#fbf7ec', 300: '#dbc27c', 400: '#c8a951', 500: '#ad8a32', 700: '#76591d' },
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'], display: ['Space Grotesk', 'sans-serif'] },
      boxShadow: { gold: '0 20px 70px rgba(200, 169, 81, .18)' },
    },
  },
  plugins: [],
}
