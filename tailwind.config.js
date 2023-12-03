/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#e72929',
      },
      gridTemplateColumns: {
        'cart-item': '1fr 2.5fr 1fr 1.5fr 1fr 0.5fr'
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')],
}
