import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/app.js',
            ],
            refresh: true,
            buildDirectory: 'build',
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'resources/images/*',
                    dest: 'images'
                },
                {
                    src: 'resources/fonts/*',
                    dest: 'fonts'
                },
                {
                    src: 'vendor/tinymce/tinymce',
                    dest: 'js'
                }
            ]
        })
    ],
    resolve: {
        alias: {
            '@bpcore': path.resolve(__dirname, 'packages/businesspress/core/resources'),
            '@': path.resolve(__dirname, 'resources'),
            'alpine': path.resolve(__dirname, 'node_modules/alpinejs/dist/alpine.js'),
        },
    },
    server: {
        watch: {
            usePolling: true,
        },
        hmr: false,
    },
    build: {
        outDir: 'public/build',
        assetsDir: '',
        manifest: 'manifest.json',
        manifestDir: 'public/build',
        rollupOptions: {
            output: {
                entryFileNames: (chunkInfo) => {
                    // If it's the main entry point, keep the original name
                    if (chunkInfo.name === 'app') {
                        return 'js/app.js';
                    }
                    return 'js/[name]-[hash].js';
                },
                chunkFileNames: 'js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const extType = path.extname(assetInfo.name);
                    const filePath = assetInfo.originalFileName;
                    const fileName = path.basename(assetInfo.name);
                    
                    if (extType === '.css') {
                        return `css/[name]-[hash]${extType}`;
                    }
                    
                    // For images & fonts, maintain their path
                    if (filePath.startsWith('resources/fonts/') || filePath.startsWith('resources/images/')) {
                      return filePath.replace('resources/', '');
                    }
                    
                    return `assets/${fileName}`;
                },
            }
        },
    }
});