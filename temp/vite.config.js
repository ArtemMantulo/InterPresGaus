import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensure relative paths are used
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        project4: './src/project4/index.html',
        magnum: './src/magnum/index.html',
        generalViewEntranceCurrent: './src/breigproject/current/generalviewentrance/index.html',
        generalViewSecondvisitCurrent: './src/breigproject/current/generalviewsecondvisit/index.html',
        closeViewCurrent: './src/breigproject/current/closeview/index.html',
        generalViewFuture: './src/breigproject/future/generalview/index.html',
        closeViewFuture: './src/breigproject/future/closeview/index.html',
        test_atrium: './src/test_atrium/index.html',
        test_breig: './src/test_breig/index.html',
      },
      external: [],
    },
  },
  optimizeDeps: {
    include: ['three'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  plugins: [
    {
      name: 'configure-response-headers',
      configureServer: server => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          next();
        });
      },
    },
  ],
});
