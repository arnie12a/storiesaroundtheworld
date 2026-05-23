/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        clay: {
          50:  '#fdf6f0',
          100: '#fae8d8',
          200: '#f5cba8',
          400: '#e08a50',
          500: '#d4713a',
          600: '#c05e2a',
          700: '#a34d20',
        },
        sand: {
          50:  '#faf8f5',
          100: '#f3ede4',
          200: '#e8ddd0',
          300: '#d4c4b0',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
