/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C5C',
          light: '#1A6A7E',
          dark: '#0A3A47',
        },
        secondary: {
          DEFAULT: '#FFFDF8',
          light: '#FFFFFF',
          dark: '#F5F0E8',
        },
        accent: {
          DEFAULT: '#D4A017',
          light: '#E6B422',
          dark: '#B8860B',
        },
        text: {
          DEFAULT: '#2B2B2B',
          light: '#5A5A5A',
          muted: '#8A8A8A',
        },
        success: '#2E8B57',
        warning: '#E67E22',
        error: '#C0392B',
      },
    },
  },
  plugins: [],
}