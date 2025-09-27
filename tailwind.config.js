// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          'ultra-light': 'var(--color-primary-ultra-light)',
          'light': 'var(--color-primary-light)',
          'semi-light': 'var(--color-primary-semi-light)',
          'DEFAULT': 'var(--color-primary)', // Using 'DEFAULT' for the base color
          'semi-dark': 'var(--color-primary-semi-dark)',
          'dark': 'var(--color-primary-dark)',
          'ultra-dark': 'var(--color-primary-ultra-dark)',
        },
        neutral: {
          'ultra-light': 'var(--color-neutral-ultra-light)',
          'light': 'var(--color-neutral-light)',
          'semi-light': 'var(--color-neutral-semi-light)',
          'DEFAULT': 'var(--color-neutral)', // Using 'DEFAULT' for the base color
          'semi-dark': 'var(--color-neutral-semi-dark)',
          'dark': 'var(--color-neutral-dark)',
          'ultra-dark': 'var(--color-neutral-ultra-dark)',
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}