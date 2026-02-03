import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue2()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'HijriGregorianCalendarVue2',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
            external: ['vue', '@sherifnabil/hijri-gregorian-calendar-core'],
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
