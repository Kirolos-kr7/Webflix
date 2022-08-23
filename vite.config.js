import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        '/favicon.ico',
        '/the-matrix-resurrections.jpg',
        '/robots.txt',
        '/apple-touch-icon.png',
        '/pwa-192x192.png',
        '/pwa-512x512.png',
        '/banner.jpg'
      ],
      manifest: {
        name: 'Webflix',
        short_name: 'Webflix',
        description: 'Webflix movie app',
        start_url: '/',
        scope: '.',
        theme_color: '#001e26',
        background_color: '#001e26',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Trending on Webflix',
            url: '/'
          },
          {
            name: 'Movies on Webflix',
            url: '/movies'
          },
          {
            name: 'Series on Webflix',
            url: '/series'
          }
        ]
      }
    })
  ]
})
