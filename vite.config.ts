import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [ VantResolver() ],
        }),
    ],
    resolve: {
        // 设置常用路径别名
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    // 配置前端服务器
    server: {
        host: '0.0.0.0',
        port: 80,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
})
