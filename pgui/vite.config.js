import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            // string shorthand
            '/api': 'http://localhost:8389'
        }
    },
    optimizeDeps: { exclude: ["vue-router"] }
})
