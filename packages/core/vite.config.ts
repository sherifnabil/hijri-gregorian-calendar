import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'DualDatePickerCore',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
            external: ['date-fns', 'date-fns/locale', 'hijri-date', 'hijri-date/lib/safe'],
            output: {
                preserveModules: false,
                exports: 'named'
            }
        },
        sourcemap: true,
        minify: false
    }
});
