import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                content: resolve(__dirname, 'content.ts'),
                background: resolve(__dirname, 'background.ts'),
                popup: resolve(__dirname, 'popup/popup.ts')
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name].js',
                format: 'es'
            }
        },
        target: 'esnext',
        minify: false,
        sourcemap: true
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../src')
        }
    }
});
