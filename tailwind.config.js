/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 14s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to:   { transform: 'translate3d(-50%,0,0)' },
        },
      },
    },
  },
  plugins: [],
}
