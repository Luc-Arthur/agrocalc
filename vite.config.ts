import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Le site est publié sur https://luc-arthur.github.io/agrocalc/
export default defineConfig({
  base: '/agrocalc/',
  plugins: [vue(), tailwindcss()],
})
