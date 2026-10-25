/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        linen: {
          DEFAULT: '#F5EBDD',
          light: '#FAF5EE',
          dark: '#EBDCC8'
        },
        coral: {
          DEFAULT: '#F2765E',
          hover: '#E06249',
          active: '#D0533A'
        },
        slate: {
          DEFAULT: '#315B8C',
          light: '#5B88BD',
          dark: '#24456B'
        },
        espresso: {
          DEFAULT: '#413333',
          card: '#4E3E3E',
          elevated: '#5C4A4A',
          muted: '#6E5A5A'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        soft: '0 8px 30px rgba(65, 51, 51, 0.08)',
        card: '0 4px 16px rgba(65, 51, 51, 0.06)'
      }
    }
  },
  plugins: []
};
