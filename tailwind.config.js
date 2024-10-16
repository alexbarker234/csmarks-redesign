/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#27348B",
        "primary-blue-dark": "#1d2769",
        "primary-gold": "#E2B600"
      }
    }
  },
  plugins: []
};
