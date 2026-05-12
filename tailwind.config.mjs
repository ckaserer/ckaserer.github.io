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
        canvas:  '#F7F5F0',
        ink:     '#111110',
        muted:   '#6B6B6A',
        border:  '#E5E2DC',
        card:    '#FFFFFF',
        accent: {
          DEFAULT: '#C9663B',
          light:   '#E07A4A',
          dark:    '#A85230',
        },
      },
    },
  },
  plugins: [],
};
