import { getCollection, type CollectionEntry } from 'astro:content';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

/**
 * Written content, read once and flattened to what the components take.
 *
 * Three things live here because more than one place needs them: the date
 * strings (a `Date` becomes both the display form and the ISO form, and the
 * index and the route file must not disagree about either), the Lab glob
 * (every experiment in src/lab exports `labMeta`, and the index and the route
 * file both have to see it), and the published split.
 *
 * Notes and client work are markdown in src/content. The Lab is Astro
 * components — it is discovered, not listed.
 *
 * `allNotes` is everything; `notes` is only what has a page behind it. A draft
 * still belongs on its own index with no route, but it must not reach the feed,
 * the carousel, or anything else that implies a URL. Only the routes and the
 * indexes link drafts, so those read `allNotes` and gate on `published`
 * themselves; every other consumer uses `notes`.
 */

export type Note = CollectionEntry<'notes'>;
export type Case = CollectionEntry<'work'>;

/** `12 Sep 2026`, for display. */
export const formatDate = (date: Date) =>
	date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

/**
 * `2026-09-12`, for <time datetime>, schema, and ordering.
 *
 * Read in local time, deliberately. The schema coerces frontmatter dates to a
 * Date at local midnight, and a local-midnight Date in a timezone east of UTC
 * is the *previous* day once converted with toISOString() — which would put the
 * machine-readable date a day behind the displayed one, and ship that off to
 * search engines and the feed. Padding each part to two digits keeps it
 * sortable as text without going back through UTC.
 */
export const isoDate = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
		date.getDate(),
	).padStart(2, '0')}`;

/** Every note, drafts included, newest first. */
export const allNotes: Note[] = (await getCollection('notes')).sort((a, b) =>
	isoDate(b.data.date).localeCompare(isoDate(a.data.date)),
);

/**
 * Newest first, published only — these are the notes that have a page, so this
 * is what the feed and the carousel must read. Sorted on the ISO form so it
 * compares as text.
 */
export const notes: Note[] = allNotes.filter((note) => note.data.published);

export const allCases: Case[] = (await getCollection('work')).sort((a, b) =>
	b.data.year.localeCompare(a.data.year),
);

/** Published only. */
export const cases: Case[] = allCases.filter((entry) => entry.data.published);

const experiments = import.meta.glob<{
	default: AstroComponentFactory;
	labMeta: DemoMeta;
}>('../lab/*.astro', { eager: true });

export interface DemoMeta {
	title: string;
	copy: string;
	cta: string;
	published: boolean;
}

export interface Demo extends DemoMeta {
	slug: string;
	/** The experiment component, ready to render. */
	Experiment: AstroComponentFactory;
}

export const demos: Demo[] = Object.entries(experiments)
	.map(([path, module]) => ({
		slug: path.replace(/^.*\/(.*)\.astro$/, '$1'),
		Experiment: module.default,
		...module.labMeta,
	}))
	.sort((a, b) => a.title.localeCompare(b.title));