/**
 * Regenerate the raster icons from public/favicon.svg.
 *
 * The SVG stays the single source for the mark; this only rasterises it. Run
 * after editing the mark in Penpot and exporting:
 *
 *   npm run icons
 *
 * Four assets, because each consumer wants a different thing:
 *   favicon.ico          legacy /favicon.ico request, three sizes in one file
 *   favicon-dark.ico     same, for consumers that cannot read an SVG favicon
 *   apple-touch-icon.png iOS, which ignores SVG and would otherwise screenshot
 *   icon-192.png         /site.webmanifest, read from a home screen or a
 *                        saved shortcut
 *
 * The SVG flips on its own via prefers-color-scheme. Rasters cannot — an ICO
 * has no variant mechanism and a PNG cannot branch on a media query — so the
 * dark one is baked here and declared in the head with a media attribute. That
 * is what covers Safari, which does not read SVG favicons at all.
 *
 * sharp ignores the media query and renders the light rules, which is the
 * right default to bake in. The dark frames come from appending an override
 * rather than by editing colours: same specificity, later in the cascade, so
 * it wins over both the default rules and the media block.
 *
 * Letters are converted to paths in the SVG, so no font is needed here or in
 * the browser — browsers render an SVG favicon in a sandbox and will not load
 * a webfont for it, so a text-based one would silently fall back to a system
 * face.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source = fileURLToPath(new URL('../public/favicon.svg', import.meta.url));
const svg = readFileSync(source, 'utf8');

/** The same mark, forced to the dark palette. */
const CREAM = '#f6efe3';
const OLIVE = '#3f4a24';
const darkSvg =
	svg.replace(
		'</svg>',
		`<style>.bg{fill:${OLIVE}}.fg{fill:${CREAM}}</style></svg>`
	);

/**
 * Packs PNGs into an ICO: a 6-byte header, a 16-byte directory entry per image,
 * then the image data. Embedding PNGs is valid from Vista onwards and every
 * current browser reads it, so there is no need to hand-encode BMP frames.
 */
const ico = (images) => {
	const header = Buffer.alloc(6 + 16 * images.length);
	header.writeUInt16LE(1, 2); // type 1 = icon
	header.writeUInt16LE(images.length, 4);

	let offset = header.length;
	images.forEach(({ size, data }, i) => {
		const at = 6 + i * 16;
		header[at] = size & 0xff; // 0 would mean 256; unused here
		header[at + 1] = size >> 8;
		header.writeUInt16LE(1, at + 4); // colour planes
		header.writeUInt16LE(32, at + 6); // bits per pixel
		header.writeUInt32LE(data.length, at + 8);
		header.writeUInt32LE(offset, at + 12);
		offset += data.length;
	});

	return Buffer.concat([header, ...images.map(({ data }) => data)]);
};

const SIZES = [16, 32, 48];
const png = (input, size) => sharp(input).resize(size, size).png().toBuffer();

const build = async (input) =>
	ico(await Promise.all(SIZES.map(async (size) => ({ size, data: await png(input, size) }))));

const publicDir = new URL('../public/', import.meta.url);
await Promise.all([
	writeFileSync(new URL('favicon.ico', publicDir), await build(source)),
	writeFileSync(new URL('favicon-dark.ico', publicDir), await build(Buffer.from(darkSvg))),
	writeFileSync(new URL('apple-touch-icon.png', publicDir), await png(source, 180)),
	writeFileSync(new URL('icon-192.png', publicDir), await png(source, 192)),
]);

console.log(
	`favicon.ico + favicon-dark.ico (${SIZES.join('/')}), apple-touch-icon.png, icon-192.png`
);