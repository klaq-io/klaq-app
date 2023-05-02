/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      sidebar: "#111c43",
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
