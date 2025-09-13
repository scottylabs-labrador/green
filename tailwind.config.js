/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-green': '#3e5636',
        sunflower: '#ddd31d',
        'sunflower-70': '#ddd31db0',
        'dark-sunflower': '#d0c604',
        'dark-sunflower-70': '#d0c604b0',
        'soft-green': '#84a787',
        magenta: '#6d0846',
        'dark-magenta': '#560638',
        'soft-magenta': '#e2a6e3',
        peach: '#e9b79f',
        carrot: '#c74a10',
        apricot: '#eC956d',
      },
    },
  },
  plugins: [],
};
