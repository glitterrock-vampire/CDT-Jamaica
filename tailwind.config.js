/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using class strategy
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af',
          dark: '#1e3a8a',
        },
        // Dark mode colors
        dark: {
          bg: '#111827',
          surface: '#1f2937',
          text: '#f3f4f6',
          muted: '#9ca3af',
        },
      },
      backgroundColor: {
        'dark': '#111827',
        'dark-surface': '#1f2937',
      },
      textColor: {
        'dark': '#f3f4f6',
        'dark-muted': '#9ca3af',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  important: false,
}
