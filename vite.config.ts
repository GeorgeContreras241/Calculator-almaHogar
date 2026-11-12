import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Identifica cada build y se publica en /version.json para que la app en
// ejecución pueda detectar si hay una versión nueva desplegada.
const BUILD_ID = Date.now().toString(36)

export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID)
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    {
      name: 'version-json',
      apply: 'build',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: JSON.stringify({ build: BUILD_ID })
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
