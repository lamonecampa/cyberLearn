import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {spawn} from 'child_process';

function apiServerPlugin() {
  let child: any = null;
  return {
    name: 'api-server-runner',
    configureServer() {
      console.log('[Vite API Plugin] Spawning Express API on port 3001...');
      child = spawn('npx', ['tsx', 'src/api/server-run.ts'], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, PORT: '3001' }
      });
      process.on('exit', () => child?.kill());
    },
    closeBundle() {
      if (child) child.kill();
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
