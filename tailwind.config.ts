import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#0A4DAA', // Futuristic Blue
          light: '#1A6AE0',
          dark: '#083C85',
          foreground: '#FFFFFF',
        },
        // Secondary/Accent Colors
        accent: {
          DEFAULT: '#FF7F57', // Bright Coral
          foreground: '#FFFFFF',
        },
        // Neutral Colors
        background: '#F8F9FA',
        foreground: '#343A40',
        muted: {
          DEFAULT: '#F1F3F5',
          foreground: '#6C757D',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#343A40',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#343A40',
        },
        border: '#E9ECEF',
        input: '#E9ECEF',
        ring: '#0A4DAA',
        destructive: {
          DEFAULT: '#FF4444',
          foreground: '#FFFFFF',
        },
        // Chart Colors
        chart: {
          '1': '#0A4DAA',
          '2': '#FF7F57',
          '3': '#1A6AE0',
          '4': '#FF9B80',
          '5': '#6C757D',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;