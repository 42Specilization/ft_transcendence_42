/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
    './index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oxanium', 'sans-serif']
      },
      backgroundImage: {
        galaxy: "url('/background-galaxy.png')",
      }
    },
  },
  plugins: [],
}
