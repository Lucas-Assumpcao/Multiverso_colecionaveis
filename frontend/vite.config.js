import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'

export default defineConfig(({ command }) => {
  if (command === 'build' && !process.env.VITE_API_URL?.trim()) {
    throw new Error('Configure VITE_API_URL nas variáveis de ambiente do projeto frontend.');
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: Object.fromEntries(
        ['/produtos', '/categorias', '/clientes', '/login', '/pedidos', '/enderecos', '/pagamentos', '/admin', '/webhooks']
          .map((caminho) => [caminho, { target: 'http://localhost:3000', changeOrigin: true }]),
      ),
    },
  };
});
