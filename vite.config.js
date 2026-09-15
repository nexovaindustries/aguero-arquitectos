import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';
import { defineConfig } from 'vite';

// Estos tres se cargan como scripts clasicos (no module) porque
// tailwind.config.js debe ejecutarse antes del CDN de Tailwind.
// Vite no los bundlea, asi que los copiamos tal cual al dist.
const scriptsClasicos = ['preloader.js', 'tailwind.config.js', 'footer.js'];

export default defineConfig({
  plugins: [
    {
      name: 'copiar-scripts-clasicos',
      writeBundle(options) {
        const out = options.dir || resolve(__dirname, 'dist');
        mkdirSync(out, { recursive: true });
        for (const f of scriptsClasicos) {
          copyFileSync(resolve(__dirname, f), resolve(out, f));
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        proyectos: resolve(__dirname, 'proyectos.html'),
        servicios: resolve(__dirname, 'servicios.html'),
        nosotros: resolve(__dirname, 'nosotros.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        entrevistas: resolve(__dirname, 'entrevistas.html'),
      },
    },
  },
});