/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your project
      "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
      "node_modules/@material-tailwind/react/theme/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  