/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    './src/**/*.{html,jsx,js,ts,tsx,css,scss,sass,less,stylus}',
    './public/**.*{html,ts,tsx,css,scss,sass,less,stylus}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rajdhani', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

