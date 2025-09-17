/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LCO Brand Colors
        primary: {
          DEFAULT: '#4A90E2',  // Trust blue
          dark: '#3570B8',
          light: '#6BA3E9',
        },
        secondary: {
          DEFAULT: '#2E5A87',  // Darker Blue - Depth & reliability
          dark: '#1E3D5C',
          light: '#4A7DAB',
        },
        accent: {
          DEFAULT: '#2d5016',  // Forest green - Nature/landscaping
          dark: '#1F3A0F',
          light: '#3E6A20',
        },
        neutral: {
          dark: '#2D3748',
          medium: '#4A5568',
          light: '#A0AEC0',
          extraLight: '#F7FAFC',
        },
        warning: '#F97316',  // Orange
        success: '#10B981',  // Green
        error: '#EF4444',    // Red
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config