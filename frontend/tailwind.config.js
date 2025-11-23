/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5865F2',
        secondary: '#57F287',
        background: {
          light: '#FFFFFF',
          dark: '#1E1F22'
        },
        surface: {
          light: '#F2F3F5',
          dark: '#2B2D31'
        },
        text: {
          light: '#060607',
          dark: '#F2F3F5'
        },
        'text-secondary': {
          light: '#4E5058',
          dark: '#B5BAC1'
        },
        border: {
          light: '#E3E5E8',
          dark: '#3F4147'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
