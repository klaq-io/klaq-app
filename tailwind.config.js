/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Inter var", ...defaultTheme.fontFamily.sans],
        poppins: ["Poppins"],
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      stone: colors.stone,
      sky: colors.sky,
      neutral: colors.neutral,
      gray: colors.gray,
      slate: colors.slate,
      white: colors.white,
      blue: colors.blue,
      success: colors.emerald,
      warning: colors.orange,
      danger: colors.red,
      pink: colors.pink,
      klaq: {
        50: "#f5f8f7",
        100: "#dee9e7",
        200: "#bcd3ce",
        300: "#93b5af",
        400: "#709892",
        500: "#527a75",
        600: "#40615d",
        700: "#364f4c",
        800: "#2e4140",
        900: "#293837",
        950: "#141f1f",
      },
    },
  },
  important: true,
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
