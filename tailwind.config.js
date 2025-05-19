/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'geometric-regular': ['"Roboto Regular"', 'Helvetica', 'Arial', 'sans-serif'],
        'roboto-bold': ['"Roboto Bold"', 'Helvetica', 'Arial', 'sans-serif'],
        'roboto-light': ['"Roboto Light"', 'Helvetica', 'Arial', 'sans-serif'],
        'sans': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'], 
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
  ],
};
