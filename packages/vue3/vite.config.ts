import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'DualDatePickerVue3',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
            external: ['vue', '@dual-datepicker/core'],
            output: {
                globals: {
                    vue: 'Vue'
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') return 'style.css';
                    return assetInfo.name || '';
                }
            }
        },
        sourcemap: true,
        cssCodeSplit: false
    }
});
