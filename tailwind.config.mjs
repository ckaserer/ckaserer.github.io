/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        canvas:  '#FFFFFF',
        surface: '#F0F4FF',
        navy:    '#0A1628',
        ink:     '#0A1628',
        muted:   '#475569',
        border:  '#E2E8F0',
        card:    '#FFFFFF',
        azure: {
          DEFAULT: '#0078D4',
          light:   '#2B9DEA',
          dark:    '#005A9E',
        },
        sky: {
          DEFAULT: '#50E6FF',
          light:   '#8FF0FF',
        },
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      backgroundImage: {
        'gradient-azure': 'linear-gradient(135deg, #0078D4 0%, #50E6FF 100%)',
        'gradient-navy':  'linear-gradient(135deg, #0A1628 0%, #0078D4 100%)',
      },
      boxShadow: {
        'azure': '0 20px 60px -20px rgba(0, 120, 212, 0.4)',
        'navy':  '0 20px 60px -20px rgba(10, 22, 40, 0.3)',
      },
    },
  },
  plugins: [],
};
