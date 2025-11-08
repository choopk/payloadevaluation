import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		// External packages that should not be bundled for SSR
		// Matches Next.js serverExternalPackages configuration
		noExternal: [],
		external: ['@payloadcms/db-postgres']
	}
});
