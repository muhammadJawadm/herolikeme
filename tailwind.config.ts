/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        
        colors: {
          primary: "#7897FF",
          secondary:'#FF62AE',
          greyText: "#D1D1D1",
          
        },
      },
    },
    plugins: [],
  };