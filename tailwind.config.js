/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        body: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        // Legal aesthetic fonts
        'legal-heading': [
          '"Playfair Display"',
          'Georgia',
          '"Times New Roman"',
          'serif',
        ],
        'legal-body': [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // Base colors - Legal aesthetic (light theme)
        background: '#faf9f7',      // Cream background
        primary: '#ffffff',         // White for navigation/cards

        // Text colors - Legal aesthetic
        text: '#1a2332',            // Dark navy text
        textDark: '#1a1a1a',        // Very dark text
        textMuted: '#6b7280',       // Muted gray text

        // Accent colors - Brass instead of gold
        accent: '#b8860b',          // Brass accent
        accentHover: '#d4a84b',     // Brass hover (lighter)

        // Card/Surface colors - Clean white
        card: '#ffffff',            // White cards
        cardBorder: '#e8e6e1',      // Warm gray border

        // Stat colors (adjusted for light background)
        statBlue: '#1e40af',        // Deep blue
        statGreen: '#15803d',       // Deep green
        statOrange: '#b8860b',      // Brass/gold
        statPink: '#be185d',        // Deep pink

        // Method/Process colors - Legal aesthetic
        methodBg: '#f5f3ef',        // Ivory background
        methodBorder: '#e8e6e1',    // Warm gray border
        methodNumber: '#b8860b',    // Brass accent

        // Trust section colors - Legal aesthetic
        trustOuter: '#faf9f7',      // Cream
        trustCard: '#ffffff',       // White

        // Questionnaire specific colors - Legal aesthetic
        questionCard: '#ffffff',    // White cards
        formInput: '#f5f3ef',       // Ivory input background
        buttonActive: '#b8860b',    // Brass buttons
        buttonInactive: '#e8e6e1',  // Muted inactive

        // Legal aesthetic colors (kept for reference/compatibility)
        legal: {
          navy: '#1a2332',
          charcoal: '#2d3748',
          slate: '#4a5568',
          white: '#ffffff',
          cream: '#faf9f7',
          ivory: '#f5f3ef',
          'warm-gray': '#e8e6e1',
          brass: '#b8860b',
          'brass-light': '#d4a84b',
          'brass-dark': '#8b6914',
          'text-dark': '#1a1a1a',
          'text-muted': '#6b7280',
          'text-light': '#f7f7f7',
        },
      },
      backgroundImage: {
        // Legal aesthetic gradients (subtle, light)
        'gradient-hero': 'linear-gradient(180deg, #faf9f7 0%, #f5f3ef 100%)',
        'gradient-gold': 'linear-gradient(90deg, #b8860b 0%, #d4a84b 50%, #b8860b 100%)',
        'gradient-text': 'linear-gradient(90deg, #b8860b 0%, #d4a84b 50%, #8b6914 100%)',
        'gradient-input': 'linear-gradient(145deg, #f5f3ef 0%, #e8e6e1 100%)',
      },
      boxShadow: {
        // Legal aesthetic shadows (subtle, professional)
        'card': '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.05)',
        'glow-cyan': '0 4px 12px rgba(30, 64, 175, 0.15)',
        'glow-green': '0 4px 12px rgba(21, 128, 61, 0.15)',
        'glow-orange': '0 4px 12px rgba(184, 134, 11, 0.15)',
        'glow-pink': '0 4px 12px rgba(190, 24, 93, 0.15)',
        'glow-gold': '0 4px 12px rgba(184, 134, 11, 0.2)',
        'glow-gold-soft': '0 2px 8px rgba(184, 134, 11, 0.15)',
        'legal-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'legal-md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'legal-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
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
