module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      shadow:{
       '3xl' :' 0 4px 60px 0 rgb(0,0,0,0.3)'

      }
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide")
  ],
}
