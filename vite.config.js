import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
        dedupe: ['react', 'react-dom'],
    },
    server: {
        port: 2929,
        open: true,
        host: true,
    },
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: 'react-vendor',
                            test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
                            priority: 40,
                        },
                        {
                            name: 'mui-vendor',
                            test: /node_modules[\\/](@mui|@emotion)[\\/]/,
                            priority: 30,
                        },
                        {
                            name: 'supabase-vendor',
                            test: /node_modules[\\/]@supabase[\\/]/,
                            priority: 25,
                        },
                        {
                            name: 'pdf-excel-vendor',
                            test: /node_modules[\\/](jspdf|jspdf-autotable|exceljs|xlsx|docx|file-saver)[\\/]/,
                            priority: 20,
                        },
                        {
                            name: 'vendor',
                            test: /node_modules[\\/]/,
                            priority: 10,
                        },
                    ],
                },
            },
        },
    },
});
