import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      sizes: [512],
      padding: 0.3,
      resizeOptions: {
        background: '#000000',
      },
    },
    apple: {
      sizes: [180],
      padding: 0.2,
      resizeOptions: {
        background: '#000000',
      },
    },
    transparent: {
      sizes: [64, 192, 512],
      padding: 0.1,
      resizeOptions: {
        background: 'transparent',
      },
    },
  },
  images: ['public/logo.png'],
});
