import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig((command, mode) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    assetsInclude: ['**/*.capy'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: env.BUILD_PATH ?? 'build',
      minify: false,
    },
    plugins: [react()],
    server: { port: 3000 },
    base: '',
  };
});
