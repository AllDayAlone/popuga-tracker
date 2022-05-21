module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': '#FFFFFF',
        'light': '#F6F4FC',
        'stroke': '#EAEAFC',
        'purple': '#A088E0',
        'lime': '#CBF969',
        'black': '#403A50',
        'gray': '#A29CCB',
      },
      backgroundImage: {
        'parrot': "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdLg7PQ3BDxZFif8j9rA4Ku9keq2GOY7h3gg&usqp=CAU')",
      }
    },

  },
  plugins: [],
}
