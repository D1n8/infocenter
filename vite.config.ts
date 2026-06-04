import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: '/infocenter/',

  server: {
    proxy: {
      '/api': {
        target: 'https://project-domain.ru',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'https://project-domain.ru',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
