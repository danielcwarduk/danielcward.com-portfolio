/**
 * Content for the site, extracted from the Penpot boards in the
 * danielcward.com file.
 *
 * Only data that more than one place reads lives here. Anything used once is
 * written as attributes on the tag it belongs to. Types live here rather than
 * in components, so the data layer does not import from the view layer.
 *
 * Written content is not here: notes and client work are markdown collections,
 * and the Lab is Astro components. All three are read in data/collections.ts.
 */

export interface Action {
	label: string;
	href: string;
}

export interface Field {
	label: string;
	value: string;
	href?: string;
}

export const site = {
	name: 'Daniel C. Ward',
	/**
	 * Production origin. Mirrors `site` in astro.config.mjs — the two must
	 * agree, or canonicals and schema will disagree with the sitemap. Written
	 * without a trailing slash so it can be concatenated directly.
	 */
	url: 'https://danielcward.com',
	/** Displayed on the hero and the share image, so it keeps its full stop. */
	role: 'Developer, photographer, and tinkerer.',
	/**
	 * Search-facing one-liner. Sentence case and no trailing full stop, so it
	 * reads correctly in a <title> and a SERP snippet rather than as a caption.
	 */
	tagline: 'Web developer, photographer and tinkerer',
	description:
		'UK-based web developer, photographer and tinkerer building client software, interactive browser tools, and shader experiments.',
	email: 'danielcwardprojects@gmail.com',
	photosUrl: 'https://photos.danielcward.com',
};

/**
 * Schema.org node ids for the site-level graph that BaseLayout declares. Every
 * page that references them imports these same two strings rather than
 * rebuilding them from `site.url`: an `@id` and a reference that differ by a
 * trailing slash is a dangling reference, not a render error, so nothing else
 * would catch it.
 */
export const personId = `${site.url}#person`;
export const websiteId = `${site.url}#website`;

/**
 * Breadcrumb trail for a depth-2 page, root-first. Every page that passes
 * `schema` and lives under a section uses this, so the trail Google reads is
 * the same shape on a note and a case study.
 */
export const breadcrumbs = (
	section: string,
	sectionPath: string,
	path: string,
	title: string,
) => ({
	'@type': 'BreadcrumbList',
	itemListElement: [
		{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
		{ '@type': 'ListItem', position: 2, name: section, item: `${site.url}${sectionPath}` },
		{ '@type': 'ListItem', position: 3, name: title, item: `${site.url}${path}` },
	],
});

/**
 * Site links. `trailingSlash: 'always'` in astro.config.mjs means `/work/` is
 * the URL that actually resolves on a static host, so internal hrefs are
 * written with the slash rather than normalised at render time.
 */
export const navLinks = [
	{ label: 'Work', href: '/work/' },
	{ label: 'Lab', href: '/lab/' },
	{ label: 'Notes', href: '/notes/' },
	{ label: 'Photography', href: site.photosUrl },
	{ label: 'Contact', href: '/contact/' },
];

/* footer / contacts */
export const contactFields: Field[] = [
	{ label: 'Email', value: site.email, href: `mailto:${site.email}` },
	{
		label: 'LinkedIn',
		value: 'linkedin.com/in/danielcwarduk',
		href: 'https://linkedin.com/in/danielcwarduk',
	},
	{ label: 'GitHub', value: 'github.com/danielcwarduk', href: 'https://github.com/danielcwarduk' },
];
