/** @type {import('tailwindcss').Config} */
module.exports = {
  // Hover styles only apply on devices with a real mouse. On phones a tap
  // otherwise "sticks" as a hover (e.g. a tapped arrow stays highlighted).
  future: { hoverOnlyWhenSupported: true },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // data/prints.js holds each print's aspect-[w/h] class.
    './data/**/*.{js,ts}',
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
