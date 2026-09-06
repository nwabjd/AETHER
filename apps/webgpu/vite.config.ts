import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'AETHER WebGPU',
        short_name: 'AETHER',
        description: 'Local on-device AI inference via WebGPU',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        scope: basePath,
        start_url: basePath,
        icons: [
          { src: `${basePath}icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${basePath}icon-512.png`, sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,svg,png}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    target: 'es2022',
    outDir: 'dist'
  }
});
