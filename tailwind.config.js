/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: ['selector', '[class="app-dark"]'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fdf6f5',
          100: '#f9e8e6',
          200: '#f0cdc9',
          300: '#e3aaa5',
          400: '#d28a85',
          500: '#bd6f6f',
          600: '#a35858',
          700: '#864647',
          800: '#6e3a3b',
          900: '#5c3233',
          950: '#331a1b'
        }
      },
      fontFamily: {
        sans: ['"Poppins"', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [require('tailwindcss-primeui')]
};
