/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./views/**/*.{html,ejs,js}",
    "./views/**/**/*.{html,ejs,js}"
  ],
  theme: {
    extend: {
      colors: {
        "theme-main-dark": "#1D212A",
        "theme-main-light": "#898a8c", //"#64666b" 
        "theme-main-medium": "#101935",
        "error-light": "#FCE8DB",
        "error-dark": "#EF665B",




        "x-theme-background": "#080F25",
        "x-theme-popup-background": "#101935",
        "x-theme-mini-popup-background": "#212C4D",
        "x-theme-background-active": "#212C4D",
        "x-theme-border": "#37446B",
        "x-theme-buttons": "#6C72FF",
        "x-theme-buttons-active": "#212C4D",
        "x-theme-hyperlink": "#5A4390",
        "x-theme-text-base": "#AEB9E1",
        "x-theme-text-active": "#FFFFFF",
        "x-theme-text-logout": "#F0343C"


      },      
    },
  },
  plugins: [],
}