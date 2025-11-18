/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'Poppins', 'sans-serif'],
        body: ['Inter', '"Source Sans 3"', 'sans-serif'],
        sans: ['Inter', '"Source Sans 3"', 'sans-serif'],
      },
      colors: {
        // Base colors
        background: '#0a0e27',      // Very dark navy background
        primary: '#1a1f3a',         // Dark navy for navigation

        // Text colors
        text: '#F6F7FB',            // Main text (light)
        textDark: '#0B1F4B',        // Dark text for light backgrounds
        textMuted: '#B8C5E0',       // Lighter muted text for dark bg

        // Accent colors
        accent: '#FFC447',          // Gold accent
        accentHover: '#FFB320',     // Gold accent hover

        // Card/Surface colors (lighter for contrast)
        card: 'rgba(30, 50, 100, 0.6)',        // Lighter blue with transparency
        cardBorder: 'rgba(255, 255, 255, 0.15)', // More visible border

        // Stat colors (brighter for dark background)
        statBlue: '#3DE1FF',
        statGreen: '#4AE598',
        statOrange: '#FFB34D',
        statPink: '#FF6FC7',

        // Method/Process colors
        methodBg: 'rgba(50, 90, 180, 0.5)',
        methodBorder: 'rgba(157, 176, 216, 0.4)',
        methodNumber: '#2E5BFF',

        // Trust section colors
        trustOuter: 'rgba(15, 30, 70, 0.3)',
        trustCard: 'rgba(60, 100, 170, 0.6)',

        // Questionnaire specific colors
        questionCard: 'rgba(40, 75, 140, 0.75)',
        formInput: 'rgba(55, 95, 165, 0.7)',
        buttonActive: 'rgba(70, 120, 200, 0.85)',
        buttonInactive: 'rgba(40, 70, 120, 0.4)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(180deg, #071530 0%, #0F2A73 45%, #1E3D96 100%)',
        'gradient-gold': 'linear-gradient(90deg, #FFD700 0%, #FFC107 25%, #FFB300 50%, #FFA000 75%, #FF8F00 100%)',
        'gradient-text': 'linear-gradient(90deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)',
      },
      boxShadow: {
        'card': '0 30px 90px rgba(0, 0, 0, 0.8), 0 2px 0 rgba(255, 255, 255, 0.12)',
        'glow-cyan': '0 0 40px rgba(61, 225, 255, 0.5), 0 20px 60px rgba(61, 225, 255, 0.3)',
        'glow-green': '0 0 40px rgba(74, 229, 152, 0.5), 0 20px 60px rgba(74, 229, 152, 0.3)',
        'glow-orange': '0 0 40px rgba(255, 179, 77, 0.5), 0 20px 60px rgba(255, 179, 77, 0.3)',
        'glow-pink': '0 0 40px rgba(255, 111, 199, 0.5), 0 20px 60px rgba(255, 111, 199, 0.3)',
        'glow-gold': '0 0 50px rgba(255, 215, 0, 0.7), 0 12px 48px rgba(255, 193, 7, 0.6)',
        'glow-gold-soft': '0 0 30px rgba(255, 196, 71, 0.4), 0 10px 40px rgba(255, 196, 71, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        'xl': '16px',
        '3xl': '32px',
      },
    },
  },
  plugins: [],
}
