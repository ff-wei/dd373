import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from 'unplugin-vue-components/resolvers';
import path from 'path';
import legacy from '@vitejs/plugin-legacy'
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [VantResolver()],
        }),
        legacy({
            targets: ['Chrome 58'],
        })
    ],
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/global.scss";`
            }
        }
    },
    server: {
        host: true,
        port: 80,
        open: true,
        proxy: {
            '/api': {
                target: 'http://192.168.50.12:8082',
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        },
        cors: true
    },
    preview: {
        port: 80
    }

})
