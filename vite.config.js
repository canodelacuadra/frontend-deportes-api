import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Aplicación multipágina: cada HTML debe declararse para que Vite lo incluya en el build
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        login: resolve(import.meta.dirname, 'login.html'),
        registro: resolve(import.meta.dirname, 'registro.html'),
        dashboard: resolve(import.meta.dirname, 'dashboard.html'),
        conserje: resolve(import.meta.dirname, 'conserje.html'),
      },
    },
  },
});
