/** @type {import('tailwindcss').Config} */

const config = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d9488',
        secondary: '#3b82f6',
        navy: '#1a202c',
        dark: '#242936',
        darker: '#1e222c',
        darkest: '#1a1e28',
        darkish: '#333640',
        light: '#f2f4f7',
        lighter: '#f7f7f7',
        lightest: '#fcfcfc',
        lightish: '#ebedf0',
      },
      maxWidth: {
        screen: '100vw',
      },
      fontSize: {
        xxs: '0.65rem',
      },
      fontFamily: {
        sans: [
          '"InterVariable"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        lexend: ['Lexend'],
        code: ['Fira Code'],
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};

module.exports = config;
