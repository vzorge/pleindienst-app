import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    optimizeDeps: {
        include: ['papaparse', '@skeletonlabs/skeleton']
    },
    server: {
        proxy: {
            '/api': 'http://localhost:8080',
        }
    }
});
