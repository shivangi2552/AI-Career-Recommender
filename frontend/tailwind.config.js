/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // blue-600
        accent: "#7c3aed", // purple-600
        success: "#16a34a", // green-600
      },
    },
  },
  plugins: [],
};
