import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { spawn } from 'child_process';

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

// Tambahkan parameter { command } untuk mendeteksi apakah ini 'serve' (dev) atau 'build' (prod)
export default defineConfig(({ command }) => {
  // Hanya jalankan apiServerPlugin jika berada di mode development ('serve')
  const isDev = command === 'serve';

  return {
    // Jika di Vercel (build), jalankan react() & tailwindcss() saja, abaikan apiServerPlugin()
    plugins: isDev 
      ? [react(), tailwindcss(), apiServerPlugin()] 
      : [react(), tailwindcss()],
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
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
