import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: false,
			env: {
				host: '0.0.0.0',
				port: process.env.PORT
			},
			maxBodySize: 25 * 1024 * 1024
		})
	}
};

export default config;
