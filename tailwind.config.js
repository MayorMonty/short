/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-100": "#1a1a1a",
        "dark-200": "#242424",
        "prpl-400": "#646cff",
      },
    },
  },
  plugins: [],
};
