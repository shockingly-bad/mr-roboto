import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        controller: resolve(__dirname, 'controller.html'),
        game: resolve(__dirname, 'game.html'),
      },
    },
  },
});