import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/cypress/**',
			'**/.{idea,git,cache,output,temp}/**',
			'**/{karma,rollup,webpack,vite,vitest,jest,deno,bun,astro}.config.*',
			'tests/browser/**',
			'tests/e2e/**'
		],
		globals: true,
		environment: 'jsdom',
		slowTestThreshold: 1000
	}
});
