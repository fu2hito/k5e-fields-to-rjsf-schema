import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    server: {
      proxy: {
        '/kintone-api': {
          target: `https://${env.VITE_KINTONE_DOMAIN}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/kintone-api/, ''),
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'k5e-fields-to-rjsf-schema',
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', '@rjsf/core', '@rjsf/utils'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            '@rjsf/core': 'RJSF',
            '@rjsf/utils': 'RJSFUtils',
          },
        },
      },
    },
  };
});