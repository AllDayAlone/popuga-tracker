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
        'dark-purple': '#7666A1',
        'lime': '#EDFCDD',
        'black': '#403A50',
        'gray': '#A29CCB',
        'lavender': '#EFF0FF'

      },
      backgroundImage: {
        'parrot': "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdLg7PQ3BDxZFif8j9rA4Ku9keq2GOY7h3gg&usqp=CAU')",
        'dashed': `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23A29CCB' stroke-width='2' stroke-dasharray='16%2c 16' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`,
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        'billing': 'minmax(0, 1fr) 248px',
      }
    },

  },
  plugins: [],
}
