/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff7f0',
          100: '#ffe8d6',
          400: '#FBA849',
          600: '#ff9500',
        },
      },
      spacing: {
        'sidebar': '250px',
        'middle': '350px',
      },
    },
  },
  plugins: [],
}
