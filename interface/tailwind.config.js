/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        robot: "Orbitron"
      }
    }
  },
  plugins: [],
};