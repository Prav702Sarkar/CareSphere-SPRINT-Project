/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ============================================================
      // HERWELL DESIGN TOKENS
      // ============================================================
      colors: {
        // Women's palette — Lavender / Rose / Peach warmth
        woman: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        rose: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        peach: {
          50:  '#fff8f0',
          100: '#ffefd8',
          200: '#ffdcb0',
          300: '#ffc37e',
          400: '#ffa14a',
          500: '#ff8423',
          600: '#f06208',
          700: '#c74b09',
          800: '#9e3b10',
          900: '#7f3210',
          950: '#451608',
        },
        // Men's palette — Navy / Teal / Slate
        man: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        navy: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a4bcfd',
          400: '#7e96f8',
          500: '#5a6ff0',
          600: '#4050e4',
          700: '#3440ca',
          800: '#2c36a3',
          900: '#2a3382',
          950: '#1a1f4c',
        },
        // Shared neutrals
        caresphere: {
          bg: '#fafaf9',
          surface: '#ffffff',
          border: '#e8e8e8',
          text: '#1a1a2e',
          muted: '#6b7280',
          accent: '#c026d3',
        },
        herwell: {
          bg: '#fafaf9',
          surface: '#ffffff',
          border: '#e8e8e8',
          text: '#1a1a2e',
          muted: '#6b7280',
          accent: '#c026d3',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'Outfit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.1)',
        'glow-woman': '0 0 20px rgba(192, 38, 211, 0.15)',
        'glow-man': '0 0 20px rgba(2, 132, 199, 0.15)',
      },
      backgroundImage: {
        'gradient-woman': 'linear-gradient(135deg, #fdf4ff 0%, #fff1f2 50%, #fff8f0 100%)',
        'gradient-man': 'linear-gradient(135deg, #f0f9ff 0%, #f0fdfa 50%, #f0f4ff 100%)',
        'gradient-hero-woman': 'linear-gradient(135deg, #c026d3 0%, #e11d48 50%, #f06208 100%)',
        'gradient-hero-man': 'linear-gradient(135deg, #0284c7 0%, #0d9488 50%, #3440ca 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}
