/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
    './index.html'
  ],
  theme: {
    fontFamily: {

    },
    extend: {
      backgroundImage: {
        galaxy: "url('/background-galaxy.png')"
      }
    },
  },
  plugins: [],
}
