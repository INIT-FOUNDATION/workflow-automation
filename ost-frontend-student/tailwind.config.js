/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [    function({ addUtilities }) {
    addUtilities({
      '.underline-offset-4': {
        'text-underline-offset': '4px',
      },
    }, ['responsive', 'hover'])
  }],
}

