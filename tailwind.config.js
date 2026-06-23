/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#080807',
          light: '#111110',
          mid: '#1c1b18',
          border: '#2a2825',
        },
        parchment: {
          DEFAULT: '#f2ede4',
          dim: '#b0a99e',
          mute: '#5e5a55',
        },
        gold: {
          DEFAULT: '#c8a45e',
          light: '#d4b878',
          dark: '#9e7e3c',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
}
