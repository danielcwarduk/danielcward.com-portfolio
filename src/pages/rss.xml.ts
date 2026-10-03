import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { notes } from '../data/collections';
import { site } from '../data/content';

/**
 * The feed. Built from the same `notes` array as the index and the routes, so
 * an entry cannot appear here for a post that has no page, or the reverse.
 */
export async function GET(context: APIContext) {
	return rss({
		title: `Notes — ${site.name}`,
		description: site.description,
		site: context.site!,
		customData: '<language>en-gb</language>',
		items: notes.map((note) => ({
			title: note.data.title,
			description: note.data.excerpt,
			pubDate: note.data.date,
			link: `/notes/${note.id}/`,
			author: site.email,
		})),
	});
}