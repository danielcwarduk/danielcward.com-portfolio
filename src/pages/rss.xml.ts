import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { isoDate, notes } from '../data/collections';
import { site, siteOrigin } from '../data/content';

/**
 * The feed. `notes` is the published-only array, so an entry here always has a
 * page behind it — a draft listed on the index has no route, and must not
 * appear in a feed either.
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
			// Rebuilt from the ISO date at UTC noon rather than reusing
			// note.data.date. That Date is local midnight, and the feed has to
			// serialise it as UTC — which pushes a BST date back into the
			// previous day, the same off-by-one the ISO helper exists to avoid.
			// Noon leaves the calendar day intact either side of UTC, and a post
			// is not more precise than a day anyway.
			pubDate: new Date(`${isoDate(note.data.date)}T12:00:00Z`),
			link: `${siteOrigin}notes/${note.id}/`,
			author: site.email,
		})),
	});
}