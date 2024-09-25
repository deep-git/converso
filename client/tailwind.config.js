/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'lg-normal': '1440px',
      },
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
        open_sans: ["Open Sans", "sans-serif"]
      },
      colors: {
        default_white: "#ffffff",
        default_black: "#000000",
        light_gray_background: "#F5F6FA",
        purplish_blue: "#4B4DF7",
        primary_blue: "#3498DB",
        medium_gray: "#222627",
        light_gray_text: "#5E5F61",
        new_chat: "#069BFF",
        primary_red: "#E74C3C",
        primary_orange: "#E67E22",
        light_gray_border: "#EBEBED",
        lighter_medium_gray: "#323337",
      }
    },
  },
  plugins: [],
}

