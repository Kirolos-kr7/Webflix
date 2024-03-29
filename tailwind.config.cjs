module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'wf-300': '#001e26',
        'wf-200': '#012a35',
        'wf-100': '#255461'
      },
      maxWidth: {
        break: '1600px'
      },
      minWidth: {
        break: '1600px'
      },
      fontFamily: {
        bebasNeue: 'Bebas Neue',
        stMono: 'Share Tech Mon'
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
