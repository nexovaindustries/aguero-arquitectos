import { resolve } from 'path';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { createHash } from 'crypto';
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

        // Se sirven sin hash en el nombre y con cache de 4h, asi que un
        // cambio (por ejemplo una entrada nueva del menu) no llegaba a
        // quien ya tuviera la version anterior. Se les anade ?v=<hash>
        // del contenido para que el navegador vuelva a pedirlos.
        const versiones = {};
        for (const f of scriptsClasicos) {
          const contenido = readFileSync(resolve(__dirname, f));
          versiones[f] = createHash('sha256').update(contenido).digest('hex').slice(0, 8);
          copyFileSync(resolve(__dirname, f), resolve(out, f));
        }

        for (const html of readdirSync(out).filter(n => n.endsWith('.html'))) {
          const ruta = resolve(out, html);
          let s = readFileSync(ruta, 'utf8');
          for (const [f, v] of Object.entries(versiones)) {
            s = s.split(`"./${f}"`).join(`"./${f}?v=${v}"`);
          }
          writeFileSync(ruta, s);
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
