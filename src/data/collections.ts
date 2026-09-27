import { getCollection, type CollectionEntry } from 'astro:content';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

/**
 * Written content, read once and flattened to what the components take.
 *
 * Two things live here because two places need them: the date strings (a
 * `Date` becomes both the display form and the ISO form, and the index and the
 * route file must not disagree about either), and the Lab glob (every
 * experiment in src/lab exports `labMeta`, and the index and the route file
 * both have to see it).
 *
 * Notes and client work are markdown in src/content. The Lab is Astro
 * components — it is discovered, not listed.
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

/** `2026-09-12`, for <time datetime>, schema, and ordering. */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/** Newest first. Sorted on the ISO form so it compares as text. */
export const notes: Note[] = (await getCollection('notes')).sort((a, b) =>
	isoDate(b.data.date).localeCompare(isoDate(a.data.date)),
);

export const cases: Case[] = (await getCollection('work')).sort((a, b) =>
	b.data.year.localeCompare(a.data.year),
);

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