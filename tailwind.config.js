/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        gilroy: ['Gilroy', 'sans-serif'],
        gsans: ['GSans', 'sans-serif'],
        h: ['H', 'sans-serif'],
      },
    },
  },
  plugins: [],
}