/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./views/*.{html,ejs,js}", "./views/partials/*.{html,ejs,js}", "./public/**/*.{html,ejs,js,css}"],
  theme: {
    extend: {
      colors: {
        "login-menu": "#1D212A",
      },      
    },
  },
  plugins: [],
}