import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      srcDir: 'src/worker',
      filename: 'sw.ts',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Spotify Car View',
        short_name: 'Car View',
        description: 'Spotify Steuerung fürs Auto',
        theme_color: '#222222',
        background_color: '#222222',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    },
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['spotify.deigge.net'],
    proxy: {
      '/auth': 'http://backend:3000',
      '/api': 'http://backend:3000',
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
