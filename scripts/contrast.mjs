/**
 * Contrast assertions for the tokens in src/styles/global.css.
 *
 * Every colour in that stylesheet is now the hex it resolves to, so this reads
 * the sheet rather than restating it — a palette edit fails the assertions it
 * should, which is the whole point of a check that lives in the build.
 *
 * Dependency-free on purpose: run it anywhere, no browser needed.
 *
 *   node scripts/contrast.mjs
 */

import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

/**
 * Resolves a custom property to a hex, following `var(--other)` references.
 * Returns undefined when the scope does not declare it.
 *
 * `.on-inverse` re-points --fg, --fg-muted, --fg-accent-text and the border
 * trio, so most of these have two values — a reader that took the first would
 * silently assert the wrong scope.
 */
// Anchored on the rule, not the name: several comments above it mention
// `.on-inverse`, and splitting at the first mention would swallow the tokens.
const inverseRule = css.indexOf('.on-inverse {');
const scopes = {
	root: css.slice(0, inverseRule),
	inverse: css.slice(inverseRule),
};

const resolve = (name, scope) => {
	const found = scopes[scope].match(new RegExp(`${name}:\\s*([^;]+);`, 'i'));
	if (!found) return undefined;

	const value = found[1].trim();
	// Bare hex, or a shorthand carrying one (--border-hairline is `1px solid …`).
	const hex = value.match(/#[0-9a-f]{6}/i);
	if (hex) return hex[0];

	const referenced = value.match(/var\((--[\w-]+)\)/);
	if (!referenced) return undefined;

	// Scope first, then root: .on-inverse points --fg at --core-cream, which
	// lives in the root block and is never re-pointed itself.
	return resolve(referenced[1], scope) ?? resolve(referenced[1], 'root');
};

const token = (name, scope = 'root') => {
	const hex = resolve(name, scope);
	if (!hex) throw new Error(`no ${name} on :${scope} in global.css`);
	return hex;
};

const toLinear = (c) => {
	c /= 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance. */
const luminance = (hex) => {
	const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16)));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/* -- the pairs that must hold ---------------------------------------------
   Text pairs at WCAG AA 4.5:1, non-text at SC 1.4.11 3:1. Decorative rules
   and hover states are deliberately absent: neither can drop below threshold
   without the corresponding base pair moving first.

   `inverse: true` reads the foreground from the .on-inverse block, which is
   where the panel surfaces live. */

const pairs = [
	['body text', '--fg', '--bg', 4.5],
	['muted body copy', '--fg-muted', '--bg', 4.5],
	['body on --bg-subtle', '--fg', '--bg-subtle', 4.5],
	['muted copy on --bg-subtle', '--fg-muted', '--bg-subtle', 4.5],
	['accent text (nav current, hover)', '--fg-accent-text', '--bg', 4.5],

	['inverse heading', '--fg', '--bg-inverse', 4.5, true],
	['inverse muted copy', '--fg-muted', '--bg-inverse', 4.5, true],
	['inverse accent text (hover)', '--fg-accent-text', '--bg-inverse', 4.5, true],

	['btn--solid label', '--fg', '--bg', 4.5],
	['btn--accent label', '--fg', '--bg-accent', 4.5, true],
	['btn--inverse label', '--fg', '--bg-inverse', 4.5, true],

	['card--plain hairline', '--border-hairline', '--bg', 3],
	['focus ring on page', '--fg', '--bg', 3],
	['focus ring on inverse', '--fg', '--bg-inverse', 3, true],
];

let failed = 0;

console.log('Contrast assertions\n');

for (const [label, fgToken, bgToken, min, inverse] of pairs) {
	const fg = token(fgToken, inverse ? 'inverse' : 'root');
	const bg = token(bgToken);
	const ratio = contrast(fg, bg);
	const ok = ratio >= min;
	if (!ok) failed++;
	console.log(
		`  ${(ok ? 'ok' : 'FAIL').padEnd(4)}  ${label.padEnd(34)} ${fg} on ${bg}  ${ratio
			.toFixed(2)
			.padStart(5)}:1  (needs ${min})`,
	);
}

if (failed > 0) {
	console.error(`${failed} contrast assertion(s) failed.`);
	process.exit(1);
}

console.log('\nAll contrast assertions passed — no accepted deviations remain.');