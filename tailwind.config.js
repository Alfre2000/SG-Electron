module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-blue': '#123A73',
        'btn-blue': '#005ABB',
        'card-blue': '#007AFF',
        'gray-blue': '#4C4E61',
        'btn-dark-blue': '#05196e'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      boxShadow: {
        'header': 'inset 0px 1px 40px 6px rgb(0 0 25 / 20%)',
        'card': '0px 30px 40px -20px rgb(137 137 137 / 20%)'
      }
    },
  },
  plugins: [],
}