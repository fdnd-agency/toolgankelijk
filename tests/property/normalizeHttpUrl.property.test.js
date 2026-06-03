import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { normalizeHttpUrl } from '../../src/lib/utils/url.js';

describe('normalizeHttpUrl', () => {
	const numRuns = 200;

	it('returns null for non-string inputs', () => {
		fc.assert(
			fc.property(
				fc.anything().filter((v) => typeof v !== 'string'),
				(val) => {
					expect(normalizeHttpUrl(val)).toBeNull();
				}
			),
			{ numRuns: numRuns }
		);
	});

	it('returns null for empty or whitespace-only strings', () => {
		fc.assert(
			fc.property(
				fc.string().filter((s) => s.trim() === ''),
				(s) => {
					expect(normalizeHttpUrl(s)).toBeNull();
				}
			),
			{ numRuns: numRuns }
		);
	});

	it('accepts valid http and https URLs', () => {
		fc.assert(
			fc.property(fc.webUrl({ validSchemes: ['http', 'https'] }), (url) => {
				const result = normalizeHttpUrl(url);
				expect(result).not.toBeNull();
				expect(typeof result).toBe('string');
				expect(result?.startsWith('http://') || result?.startsWith('https://')).toBe(true);
			}),
			{ numRuns: numRuns }
		);
	});

	it('rejects URLs with invalid protocols', () => {
		fc.assert(
			fc.property(fc.webUrl({ validSchemes: ['ftp', 'mailto', 'file', 'data'] }), (url) => {
				expect(normalizeHttpUrl(url)).toBeNull();
			}),
			{ numRuns: numRuns }
		);
	});

	it('trims whitespace and still accepts valid URLs', () => {
		fc.assert(
			fc.property(fc.webUrl({ validSchemes: ['http', 'https'] }), (url) => {
				const paddedUrl = `  ${url}  `;
				const result = normalizeHttpUrl(paddedUrl);
				expect(result).not.toBeNull();
				expect(typeof result).toBe('string');
				expect(new URL(result ?? '').href).toBe(new URL(url).href);
			}),
			{ numRuns: numRuns }
		);
	});

	it('returns null for malformed URL strings', () => {
		fc.assert(
			fc.property(
				fc.string().filter((s) => {
					try {
						new URL(s);
						return false;
					} catch {
						return true;
					}
				}),
				(s) => {
					expect(normalizeHttpUrl(s)).toBeNull();
				}
			),
			{ numRuns: numRuns }
		);
	});
});
