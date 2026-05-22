/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nv-blue': '#001A5C',
        'nv-blue-light': '#002580',
      },
    },
  },
  plugins: [],
}
