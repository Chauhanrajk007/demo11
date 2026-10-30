/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        enterprise: {
          blue: '#00205B',
          red: '#D40511',
          yellow: '#FFCC00',
        },
      },
    },
  },
  plugins: [],
};