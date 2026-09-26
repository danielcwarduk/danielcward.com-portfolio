import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Written content. Notes and client work are markdown files; the Lab is not
 * here, because its experiments are Astro components and live in src/lab.
 *
 * `published` is required rather than defaulted. A note that is still being
 * written stays listed on the notes index with no route behind it, and forgetting the
 * flag must not be the thing that publishes it.
 */
export const collections = {
	notes: defineCollection({
		loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			excerpt: z.string(),
			date: z.coerce.date(),
			readingTime: z.string(),
			published: z.boolean(),
		}),
	}),
	work: defineCollection({
		loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			/** Card summary. The body below it is the case study. */
			copy: z.string(),
			year: z.string(),
			/** The client's live site. */
			href: z.url(),
			visitLabel: z.string(),
			tone: z.enum(['subtle', 'inverse']).optional(),
			published: z.boolean(),
		}),
	}),
};