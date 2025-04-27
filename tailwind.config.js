/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1677ff',
        // antd
        secondary: 'rgba(0, 0, 0, 0.65)',
        desc: 'rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};
