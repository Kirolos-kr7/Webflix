module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'darkblue-300': '#001e26',
        'darkblue-200': '#012a35',
        'darkblue-100': '#255461'
      },
      maxWidth: {
        break: '1600px'
      },
      minWidth: {
        break: '1600px'
      }
    },
    screens: {
      xs: '450px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
