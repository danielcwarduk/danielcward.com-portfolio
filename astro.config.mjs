// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// Required for canonical URLs and sitemap generation. Must match the
	// production origin exactly — a mismatch here silently emits wrong
	// canonicals, which is worse than emitting none.
	site: 'https://danielcward.com',
	// Directory-style URLs. Astro emits each page as a directory containing
	// index.html, so /work/ is the form that actually resolves on a static
	// host. Canonicals and the sitemap both normalise to match.
	trailingSlash: 'always',
	integrations: [sitemap()],
});
