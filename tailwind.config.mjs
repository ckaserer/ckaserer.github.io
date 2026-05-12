/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas:  '#FFFFFF',
        surface: '#F5F5F5',
        ink:     '#111110',
        muted:   '#525251',
        border:  '#E4E4E4',
        card:    '#FFFFFF',
        accent: {
          DEFAULT: '#C9663B',
          light:   '#E07A4A',
          dark:    '#A85230',
        },
      },
      fontSize: {
        'display': ['clamp(4rem, 12vw, 11rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },
    },
  },
  plugins: [],
};
