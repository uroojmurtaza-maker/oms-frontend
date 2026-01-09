export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/@mui/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ["Urbanist", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      colors: {
        primary: '#EA880F',
        secondary: '#FFFBF6',
        tertiary: "#E1AB20",
        textColor: "#000000",
        greenColor: "#22B286",
        borderColor: "#F2F2F2",
        // heading:"#DFE3F0",
        text: "#4E4D4D"
        // quaternary: "#yourQuaternaryColor" // Fourth important color
      },
    },
  },
  plugins: [],
};