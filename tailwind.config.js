/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./views/*.{html,ejs,js}", "./views/partials/*.{html,ejs,js}", "./public/**/*.{html,ejs,js,css}"],
  theme: {
    extend: {
      colors: {
        "theme-main-dark": "#1D212A",
        "theme-main-light": "#898a8c", //"#64666b" 
      },      
    },
  },
  plugins: [],
}