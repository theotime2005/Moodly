/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{css,xml,html,vue,svelte,ts,tsx}',
    './index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mint: {
          DEFAULT: '#A8E6CF',
          light: '#C5F0DC',
          dark: '#7ED3B2'
        },
        sky: {
          DEFAULT: '#DCEBF7',
          light: '#E8F3FA',
          dark: '#C5DCF0'
        },
        cream: {
          DEFAULT: '#FFF5E4',
          light: '#FFFBF2',
          dark: '#FFE8C5'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      }
    },
  },
  plugins: []
}
