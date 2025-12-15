import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno (como tu API_KEY)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // 'base: "./"' permite que la app funcione en cualquier subcarpeta (como GitHub Pages)
    // sin necesidad de configuración compleja de dominios.
    base: './', 
    define: {
      // Esto "inyecta" la API KEY de forma segura durante la construcción
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  }
})